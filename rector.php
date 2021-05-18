<?php

declare(strict_types=1);

use Rector\CodingStyle\Rector\FuncCall\PreslashSimpleFunctionRector;
use Rector\CodingStyle\Rector\If_\NullableCompareToNullRector;
use Rector\Core\Configuration\Option;
use Rector\Php74\Rector\Assign\NullCoalescingOperatorRector;
use Rector\Php74\Rector\Property\TypedPropertyRector;
use Rector\Set\ValueObject\SetList;
use Rector\TypeDeclaration\Rector\ClassMethod\AddVoidReturnTypeWhereNoReturnRector;
use Rector\TypeDeclaration\Rector\Param\ParamTypeFromStrictTypedPropertyRector;
use Rector\TypeDeclaration\Rector\FunctionLike\ParamTypeDeclarationRector;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $containerConfigurator): void {
    $parameters = $containerConfigurator->parameters();

    $parameters->set(Option::PATHS, [
        __DIR__ . '/ecs.php',
        __DIR__ . '/rector.php',
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ]);

    $parameters->set(Option::AUTOLOAD_PATHS, [
        __DIR__ . '/site',
    ]);

    $parameters->set(Option::SKIP, [
        __DIR__ . '**/vendor/**',
    ]);

    $parameters->set(Option::SETS, [
        SetList::DEAD_CODE,
    ]);

    $services = $containerConfigurator->services();

    $services->set(NullableCompareToNullRector::class);
    $services->set(PreslashSimpleFunctionRector::class);

    $services->set(AddVoidReturnTypeWhereNoReturnRector::class);
    $services->set(ParamTypeFromStrictTypedPropertyRector::class);
    $services->set(ParamTypeDeclarationRector::class);

    $services->set(TypedPropertyRector::class);
    $services->set(NullCoalescingOperatorRector::class);
};
