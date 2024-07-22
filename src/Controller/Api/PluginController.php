<?php

namespace Newsletter2go\Controller\Api;


use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\ContainsFilter;
use Shopware\Core\Framework\Plugin\PluginEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route(defaults: ['_routeScope' => ['api']])]
class PluginController extends AbstractController
{
    /**
     * @Route("/api/v{version}/n2g/test", name="api.v.action.n2g.testConnection", methods={"GET"})
     * @Route("/api/n2g/test", name="api.action.n2g.testConnection", methods={"GET"})
     */
    public function testConnectionAction(): JsonResponse
    {
        return new JsonResponse([
            "success" => true
        ]);
    }

    /**
     * @Route("/api/v{version}/n2g/info", name="api.v.action.n2g.getPluginInfo", methods={"GET"})
     * @Route("/api/n2g/info", name="api.action.n2g.getPluginInfo", methods={"GET"})
     */
    public function getPluginInfoAction(): JsonResponse
    {
        $response = [];
        try {
            $response['success'] = true;
            $response['version'] = $this->getPluginVersion();
        } catch (\Exception $exception) {
            $response['success'] = false;
            $response['version'] = $exception->getMessage();
        }

        return new JsonResponse($response);
    }

    private function getPluginVersion() : string
    {
        try {
            /** @var EntityRepository $pluginRepository */
            $pluginRepository = $this->container->get('plugin.repository');
            $criteria = new Criteria();
            $criteria->addFilter(new ContainsFilter('name', 'Newsletter2go'));
            $plugins = $pluginRepository->search($criteria, Context::createDefaultContext());

            /** @var PluginEntity $plugin */
            $plugin = $plugins->first();

            return $plugin->get('version');

        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
