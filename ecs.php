<?php

declare(strict_types=1);

use PhpCsFixer\Fixer\ClassNotation\ClassAttributesSeparationFixer;
use PhpCsFixer\Fixer\ClassNotation\ClassDefinitionFixer;
use PhpCsFixer\Fixer\ClassNotation\OrderedClassElementsFixer;
use PhpCsFixer\Fixer\Comment\HeaderCommentFixer;
use PhpCsFixer\Fixer\ControlStructure\NoUnneededCurlyBracesFixer;
use PhpCsFixer\Fixer\ControlStructure\NoUselessElseFixer;
use PhpCsFixer\Fixer\Operator\ConcatSpaceFixer;
use PhpCsFixer\Fixer\ReturnNotation\NoUselessReturnFixer;
use PhpCsFixer\Fixer\StringNotation\SingleQuoteFixer;
use PhpCsFixer\Fixer\Whitespace\MethodChainingIndentationFixer;
use PhpCsFixer\Fixer\Whitespace\NoExtraBlankLinesFixer;
use PhpCsFixer\Fixer\Whitespace\NoWhitespaceInBlankLineFixer;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symplify\EasyCodingStandard\ValueObject\Option;
use Symplify\EasyCodingStandard\ValueObject\Set\SetList;

return static function (ContainerConfigurator $containerConfigurator): void {
    $parameters = $containerConfigurator->parameters();
    $parameters->set(Option::PATHS, [
        __DIR__ . '/ecs.php',
        __DIR__ . '/rector.php',
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ]);
    $parameters->set(Option::SKIP, [
        __DIR__ . '/vendor',
    ]);
    $parameters->set(Option::SETS, [
        SetList::ARRAY,
        SetList::CLEAN_CODE,
        SetList::PSR_12,
    ]);

    $services = $containerConfigurator->services();
    $services->set(MethodChainingIndentationFixer::class);
    $services->set(ConcatSpaceFixer::class)
        ->call('configure', [[
            'spacing' => 'one',
        ]]);
    $services->set(ClassAttributesSeparationFixer::class);
    $services->set(ClassDefinitionFixer::class)
        ->call('configure', [[
            'multi_line_extends_each_single_line' => true,
            'single_item_single_line' => true,
        ]]);
    $services->set(NoUnneededCurlyBracesFixer::class);
    $services->set(NoUselessElseFixer::class);
    $services->set(NoUselessReturnFixer::class);
    $services->set(SingleQuoteFixer::class);
    $services->set(OrderedClassElementsFixer::class);
    $services->set(NoExtraBlankLinesFixer::class)
        ->call('configure', [[
            'tokens' => ['use'],
        ]]);
    $services->set(NoWhitespaceInBlankLineFixer::class);
    $services->set(HeaderCommentFixer::class)
        ->call('configure', [[
            'header' => file_get_contents(__DIR__ . '/NOTICE'),
            'location' => 'after_open',
        ]]);
};
