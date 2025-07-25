<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Forum\Thread;
use App\Observers\Forum\ThreadLogObserver;
use App\Services\Forum\ActivityLog\ThreadLogService;
use App\Repositories\Forum\ActivityLog\ActivityLogRepository;
use App\Models\Forum\Comment;
use App\Observers\Forum\CommentLogObserver;
use App\Services\Forum\ActivityLog\CommentLogService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // $repository = new ActivityLogRepository();
        // $threadService = new ThreadLogService($repository);
        // $commentService = new CommentLogService($repository);
        // Thread::observe(new ThreadLogObserver($threadService));
        // Comment::observe(new CommentLogObserver($commentService));
    }
}
