<?php

declare(strict_types=1);

use \Symplify\EasyCodingStandard\Config\ECSConfig;
use \Dubas\EspoDevLib\ValueObject\Set\SetList;

return static function (ECSConfig $ecsConfig): void {
    $ecsConfig->paths([__DIR__ . '/src', __DIR__ . '/tests']);

    $ecsConfig->sets([
        SetList::ESPOCRM,
    ]);
};
