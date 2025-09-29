<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        $middleware->api(except: [
            'api/register',
            'api/login',
            'api/job-offers',
            'api/job-offers/*', // Le '*' est un joker pour correspondre à /api/job-offers/1, /api/job-offers/2, etc.
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();