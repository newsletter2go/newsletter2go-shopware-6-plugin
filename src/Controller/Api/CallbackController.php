<?php

namespace Newsletter2go\Controller\Api;


use Newsletter2go\Entity\Newsletter2goConfig;
use Newsletter2go\Service\Newsletter2goConfigService;
use Shopware\Core\Framework\Context;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route(defaults: ['_routeScope' => ['api']])]
class CallbackController extends AbstractController
{
    private $newsletter2goConfigService;

    /**
     * AuthController constructor.
     * @param Newsletter2goConfigService $newsletter2goConfigService
     */
    public function __construct(Newsletter2goConfigService $newsletter2goConfigService)
    {
        $this->newsletter2goConfigService = $newsletter2goConfigService;
    }

    /**
     * @Route("/api/v{version}/n2g/callback", name="api.v.action.n2g.callback", methods={"POST"}, defaults={"auth_required"=false})
     * @Route("/api/n2g/callback", name="api.action.n2g.callback", methods={"POST"}, defaults={"auth_required"=false})
     * @param Request $request
     * @param Context $context
     * @return JsonResponse
     */
    public function authAction(Request $request, Context $context): Response
    {
        $response = [];
        $config = [];
        $config['auth_key'] = $request->get('auth_key');
        $config['access_token'] = $request->get('access_token');
        $config['refresh_token'] = $request->get('refresh_token');
        $config['company_id'] = $request->get('company_id');
        $config['environment'] = $request->get('environment');
        $config['user_integration_id'] = $request->get('user_integration_id');
        $apiKey = $request->get('apiKey');

        foreach ($config as $key => $value) {
            if (empty($value)) {
                unset($config[$key]);
            }
        }

        try {
            /** @var Newsletter2goConfig $savedApiKey */
            $savedApiKey = $this->newsletter2goConfigService->getConfigByFieldNames([Newsletter2goConfig::NAME_VALUE_API_KEY]);

            if (empty($savedApiKey = reset($savedApiKey)) || $savedApiKey->getValue() !== $apiKey) {
                throw new \Exception('API key is invalid');
            }


            $this->newsletter2goConfigService->addConfig($config);
            $response['success'] = true;

        } catch (\Exception $exception) {
            $response['success'] = false;
            $response['error'] = $exception->getMessage();
        }

        return new JsonResponse($response);
    }
}
