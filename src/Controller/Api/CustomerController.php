<?php

namespace Newsletter2go\Controller\Api;


use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Content\Newsletter\SalesChannel\NewsletterSubscribeRoute;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Exception\InconsistentCriteriaIdsException;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Throwable;

#[Route(defaults: ['_routeScope' => ['api']])]
class CustomerController extends AbstractController
{
    private $customerFieldController;

    /**
     * CustomerController constructor.
     * @param CustomerFieldController $customerFieldController
     */
    public function __construct(CustomerFieldController $customerFieldController)
    {
        $this->customerFieldController = $customerFieldController;
    }

    /**
     * @Route("/api/v{version}/n2g/customers", name="api.v.action.n2g.getCustomers", methods={"GET"})
     * @Route("/api/n2g/customers", name="api.action.n2g.getCustomers", methods={"GET"})
     * @param Request $request
     * @param Context $context
     * @return JsonResponse
     */
    public function getCustomersAction(Request $request, Context $context): JsonResponse
    {
        $onlySubscribed = $request->get('subscribed', 'true');
        $offset = $request->get('offset', false);
        $limit = $request->get('limit', 1000);
        $groupId = $request->get('group', false);
        $emails = json_decode($request->get('emails', '[]'), true);
        $fields = $this->customerFieldController->getCustomerEntityFields($request->get('fields', '[]'));
        $subShopId = $request->get('subShopId', null);

        try {

            $criteria = new Criteria();

            $criteria->addFilter(new EqualsFilter('customer.active', 1));

            if ($onlySubscribed == 'true' || $onlySubscribed == 1) {
                $recipientEmailList = $this->getRecipientEmailList($context);
                $criteria->addFilter(new EqualsAnyFilter('customer.email', $recipientEmailList));
            }

            if ($subShopId && $subShopId !== 0) {
                $criteria->addFilter(new EqualsFilter('customer.salesChannelId', $subShopId));
            }

            if ($offset) {
                if (!is_numeric($offset)) {
                    $offset = (int)$offset;
                }
                $criteria->setOffset($offset);
            }

            if (!is_numeric($limit)) {
                $limit = (int)$limit;
            }

            $criteria->setLimit($limit);

            if ($groupId) {

                if ($groupId === GroupController::GROUP_NEWSLETTER_RECIPIENT) {
                    $preparedNewsletterReceiver = $this->getPreparedNewsletterReceiver($onlySubscribed, $offset, $limit,
                        $emails, $subShopId, $fields);

                    $response['success'] = true;
                    $response['data'] = $preparedNewsletterReceiver;

                    return new JsonResponse($response);

                } else {
                    $groupFilter = new EqualsFilter('customer.groupId', $groupId);
                    $criteria->addFilter($groupFilter);
                }
            }

            /** @var EntityRepository $customerRepository */
            $customerRepository = $this->container->get('customer.repository');

            if (!empty($emails)) {
                $criteria->addFilter(new EqualsAnyFilter('customer.email', $emails));
            }

            //$promotionAssociationCriteria = new Criteria();
            //$promotionAssociationCriteria->addFilter(new EqualsFilter('active', 1));
            //$promotionAssociationCriteria->addAssociation('discounts');
            //$criteria->addAssociation('promotions', $promotionAssociationCriteria);
            $criteria->addAssociation('language');

            $result = $customerRepository->search($criteria, $context)->getEntities();
            $preparedList = $this->customerFieldController->prepareCustomerAttributes($result, $fields);
            $response['success'] = true;
            $response['data'] = $preparedList;

        } catch (\Exception $exception) {
            $response['success'] = false;
            $response['error'] = $exception->getMessage();
        }

        return new JsonResponse($response);
    }

    private function getPreparedNewsletterReceiver(
        $onlySubscribed,
        $offset = null,
        $limit = null,
        $emails = [],
        $subShopId = null,
        $fields = null
    ) {
        /** @var EntityRepository $newsletterRecipientRepository */
        $newsletterRecipientRepository = $this->container->get('newsletter_recipient.repository');
        $criteria = new Criteria();

        if ($offset && is_numeric($offset)) {
            $criteria->setOffset($offset);
        }

        if ($limit && is_numeric($limit)) {
            $criteria->setLimit($limit);
        }

        if ($onlySubscribed) {
            $criteria->addFilter(new EqualsAnyFilter('status', [
                NewsletterSubscribeRoute::STATUS_OPT_IN,
                NewsletterSubscribeRoute::OPTION_SUBSCRIBE,
                NewsletterSubscribeRoute::STATUS_DIRECT,
                NewsletterSubscribeRoute::STATUS_OPT_IN]));
        }

        if (!empty($emails)) {
            $criteria->addFilter(new EqualsAnyFilter('email', $emails));
        }

        if ($subShopId) {
            $criteria->addFilter(new EqualsFilter('salesChannelId', $subShopId));
        }

        $list = $newsletterRecipientRepository->search($criteria, Context::createDefaultContext())->getElements();
        return $this->customerFieldController->prepareNewsletterReceiver($list, $fields);
    }

    /**
     * @Route("/api/v{version}/n2g/customers/subscribe", name="api.v.action.n2g.subscribeCustomer", methods={"POST"})
     * @Route("/api/n2g/customers/subscribe", name="api.action.n2g.subscribeCustomer", methods={"POST"})
     * @param Request $request
     * @param Context $context
     * @return JsonResponse
     */
    public function subscribeCustomerAction(Request $request, Context $context): JsonResponse
    {
        $email = $request->get('email');

        if ($email && $request->get('Subscribe')) {
            $updateResponse = $this->_updateCustomer($email, true, $context);
            $response = $updateResponse['response'];
            $code = $updateResponse['code'];
        } else {
            $code = 400;
            $response = ['error' => 'parameter `Subscribed` and `email` can not be empty'];
        }

        return new JsonResponse($response, $code);
    }

    /**
     * @Route("/api/v{version}/n2g/customers/unsubscribe", name="api.v.action.n2g.unsubscribeCustomer", methods={"POST"})
     * @Route("/api/n2g/customers/unsubscribe", name="api.action.n2g.unsubscribeCustomer", methods={"POST"})
     * @param Request $request
     * @param Context $context
     * @return JsonResponse
     */
    public function unsubscribeCustomerAction(Request $request, Context $context): JsonResponse
    {
        $email = $request->get('email');

        if ($email && $request->get('Unsubscribe')) {
            $updateResponse = $this->_updateCustomer($email, false, $context);
            $response = $updateResponse['response'];
            $code = $updateResponse['code'];
        } else {
            $code = 400;
            $response = ['error' => 'parameter `Unsubscribed` and `email` can not be empty'];
        }

        return new JsonResponse($response, $code);
    }

    /**
     * @param $email
     * @param $newsletter
     * @param Context $context
     * @return array
     */
    private function _updateCustomer($email, $newsletter, Context $context): array
    {
        $statusCode = 400;
        $response = [];

        try {
            /** @var EntityRepository $customerRepository */
            $customerRepository = $this->container->get('customer.repository');
            $criteria = new Criteria();
            $criteria->addFilter(new EqualsFilter('email', $email));
            /** @var CustomerEntity $customer */
            $customer = $customerRepository->search($criteria, $context)->first();

            if ($customer) {
                $customerRepository->upsert([
                    [
                        'id' => $customer->getId(),
                        'newsletter' => $newsletter
                    ]
                ],
                    $context
                );

                $statusCode = 200;
                $response['success'] = true;
            }

            $newsletterUpdateResponse = $this->updateNewsletterReceiver($email, $newsletter, $context);

            if ($newsletterUpdateResponse['code'] !== 200) {
                $response = $newsletterUpdateResponse['response'];
                $statusCode = $newsletterUpdateResponse['code'];
            }

        } catch (\Exception $exception) {
            $response['success'] = false;
            $response['error'] = $exception->getMessage();
        }

        return ['response' => $response, 'code' => $statusCode];
    }

    /**
     * @param $email
     * @param $status
     * @param Context $context
     * @return array
     * @throws InconsistentCriteriaIdsException
     */
    private function updateNewsletterReceiver($email, $status, Context $context): array
    {
        $statusCode = 400;
        $response = [];

        if ($status) {
            $status = NewsletterSubscribeRoute::STATUS_DIRECT;
        } else {
            $status = NewsletterSubscribeRoute::STATUS_OPT_OUT;
        }

        /** @var EntityRepository $newsletterReceiver */
        $newsletterReceiver = $this->container->get('newsletter_recipient.repository');
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('email', $email));
        /** @var CustomerEntity $customer */
        $customer = $newsletterReceiver->search($criteria, $context)->first();

        if ($customer) {
            $newsletterReceiver->upsert([
                [
                    'id' => $customer->getId(),
                    'status' => $status
                ]
            ],
                $context
            );

            $statusCode = 200;
            $response['success'] = true;
        } else {
            $response['success'] = false;
        }

        return ['response' => $response, 'code' => $statusCode];
    }


    /**
     * @Route("/api/v{version}/n2g/customers/count", name="api.v.action.n2g.getCustomers.count", methods={"GET"})
     * @Route("/api/n2g/customers/count", name="api.action.n2g.getCustomers.count", methods={"GET"})
     * @param Request $request
     * @param Context $context
     * @return JsonResponse
     */
    public function getCustomersCount(Request $request, Context $context): JsonResponse
    {
        $response = [];
        $onlySubscribed = $request->get('subscribed');
        $groupId = $request->get('group');
        /** @var EntityRepository $customerRepository */
        $customerRepository = $this->container->get('customer.repository');

        try {
            $criteria = new Criteria();
            $criteria->addFilter(new EqualsFilter('customer.active', 1));

            if ($onlySubscribed) {
                $recipientEmailList = $this->getRecipientEmailList($context);
                $criteria->addFilter(new EqualsAnyFilter('customer.email', $recipientEmailList));
            }

            if ($groupId) {

                if ($groupId === GroupController::GROUP_NEWSLETTER_RECIPIENT) {
                    $response['success'] = true;
                    $response['count'] = count($this->getPreparedNewsletterReceiver($onlySubscribed));

                    return new JsonResponse($response);
                }

                $criteria->addFilter(new EqualsFilter('customer.groupId', $groupId));
            }

            $response['success'] = true;
            $response['count'] = $customerRepository->search($criteria, $context)->count();
        } catch (\Exception $exception) {
            $response['success'] = false;
            $response['error'] = $exception->getMessage();
        }

        return new JsonResponse($response);
    }

    /**
     * @param Context $context
     * @return array
     * @throws Throwable
     */
    private function getRecipientEmailList(Context $context): array
    {
        $newsletterRecipientRepository = $this->container->get('newsletter_recipient.repository');
        $criteria = new Criteria();
        return $newsletterRecipientRepository->search($criteria, $context)->fmap(function ($recipient) {
            return $recipient->getEmail();
        });
    }
}
