// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { User } from '../../users/entities/user.entity';

// @Entity('journal_entries')
// export class JournalEntry {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'uuid' })
//   user_id: string;

//   @ManyToOne(() => User, user => user.journalEntries)
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @Column({ length: 255, nullable: true })
//   title: string;

//   @Column({ type: 'text' })
//   content: string;

//   @Column({ type: 'tinyint', nullable: true, name: 'mood_before' })
//   mood_before: number; // 1-10

//   @Column({ type: 'tinyint', nullable: true, name: 'mood_after' })
//   mood_after: number; // 1-10

//   @Column({ type: 'json', nullable: true })
//   tags: string[];

//   @Column({ type: 'boolean', default: true, name: 'is_private' })
//   is_private: boolean;

//   @Column({ type: 'json', nullable: true, name: 'ai_analysis' })
//   ai_analysis: Record<string, any>; // AI-generated summary/insights

//   @CreateDateColumn({ name: 'created_at' })
//   created_at: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updated_at: Date;
// }