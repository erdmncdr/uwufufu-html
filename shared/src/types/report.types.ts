export type ReportTargetType = 'quiz' | 'comment' | 'user';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
export type ReportReason =
  | 'spam'
  | 'inappropriate_content'
  | 'harassment'
  | 'copyright'
  | 'misleading'
  | 'other';

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reporterId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  reviewedById?: string;
  reviewNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportDto {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
}

export interface UpdateReportDto {
  status: ReportStatus;
  reviewNote?: string;
}
