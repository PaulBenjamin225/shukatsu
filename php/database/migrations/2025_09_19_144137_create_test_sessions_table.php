<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('test_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('qcm_id')->constrained('qcms')->onDelete('cascade');
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->enum('status', ['not_started', 'in_progress', 'completed', 'suspended'])->default('not_started');
            $table->decimal('final_score', 5, 2)->nullable(); // Note sur 100.00
            $table->decimal('credibility_score', 5, 2)->nullable(); // Score de confiance sur 100.00
            $table->boolean('consent_given')->default(false); // Pour le RGPD
            $table->timestamps();

            // Un candidat ne peut passer qu'une seule fois le même QCM
            $table->unique(['candidate_id', 'qcm_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_sessions');
    }
};
