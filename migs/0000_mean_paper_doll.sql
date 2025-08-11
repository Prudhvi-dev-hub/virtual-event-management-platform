CREATE TABLE `admins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` datetime NOT NULL,
	`deleted_at` datetime,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `event_dashboard` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(500),
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`status` enum('upcoming','ongoing','completed') NOT NULL DEFAULT 'upcoming',
	`location` enum('online','offline') NOT NULL DEFAULT 'online',
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` datetime NOT NULL,
	`deleted_at` datetime,
	CONSTRAINT `event_dashboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_registry` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`participant_id` int NOT NULL,
	`status` varchar NOT NULL DEFAULT 'registered',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL,
	`deleted_at` datetime,
	CONSTRAINT `event_registry_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` datetime NOT NULL,
	`deleted_at` datetime,
	CONSTRAINT `participants_id` PRIMARY KEY(`id`),
	CONSTRAINT `participants_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `event_registry` ADD CONSTRAINT `event_registry_event_id_event_dashboard_id_fk` FOREIGN KEY (`event_id`) REFERENCES `event_dashboard`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_registry` ADD CONSTRAINT `event_registry_participant_id_participants_id_fk` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE no action ON UPDATE no action;