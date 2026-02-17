CREATE TABLE `event_planner` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(500),
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`status` enum('upcoming','ongoing','completed') NOT NULL DEFAULT 'upcoming',
	`location` enum('online','offline') NOT NULL DEFAULT 'online',
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` datetime,
	`deleted_at` datetime,
	CONSTRAINT `event_planner_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_enrollments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`event_id` bigint unsigned NOT NULL,
	`participant_id` bigint unsigned NOT NULL,
	`status` enum('registered','attended','missed') NOT NULL DEFAULT 'registered',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime,
	`deleted_at` datetime,
	CONSTRAINT `event_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `updated_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `deleted_at` datetime;--> statement-breakpoint
ALTER TABLE `participants` MODIFY COLUMN `updated_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `participants` MODIFY COLUMN `deleted_at` datetime;--> statement-breakpoint
ALTER TABLE `event_enrollments` ADD CONSTRAINT `event_enrollments_event_id_event_planner_id_fk` FOREIGN KEY (`event_id`) REFERENCES `event_planner`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_enrollments` ADD CONSTRAINT `event_enrollments_participant_id_participants_id_fk` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE no action ON UPDATE no action;