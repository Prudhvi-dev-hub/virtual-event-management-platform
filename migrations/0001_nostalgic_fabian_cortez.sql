CREATE TABLE `event_booking_board` (
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
	CONSTRAINT `event_booking_board_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_registry_board` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`participant_id` int NOT NULL,
	`status` varchar NOT NULL DEFAULT 'registered',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL,
	`deleted_at` datetime,
	CONSTRAINT `event_registry_board_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `updated_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `deleted_at` datetime;--> statement-breakpoint
ALTER TABLE `participants` MODIFY COLUMN `updated_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `participants` MODIFY COLUMN `deleted_at` datetime;--> statement-breakpoint
ALTER TABLE `event_registry_board` ADD CONSTRAINT `event_registry_board_event_id_event_booking_board_id_fk` FOREIGN KEY (`event_id`) REFERENCES `event_booking_board`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_registry_board` ADD CONSTRAINT `event_registry_board_participant_id_participants_id_fk` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE no action ON UPDATE no action;