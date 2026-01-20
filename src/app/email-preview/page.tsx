import { buildEmailContent } from '@/utils/emailTemplates';

export const metadata = {
  title: 'Email Preview',
};

export default function EmailPreviewPage() {
  const content = buildEmailContent({
    email: 'preview@example.com',
    fullName: 'Preview User',
    enrollmentId: 'TMA20260001',
    reminderType: 'confirmation',
    counselorName: 'Asha Menon',
    tokenNumber: 12,
    courseName: 'Full Payment',
    batchMonth: 'march-2026',
    trainingMode: 'online',
    totalFee: 30000,
    discountFee: 10000,
    finalFee: 20000,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#e5e7eb', padding: '24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: '12px', color: '#111827' }}>
          <strong>Subject:</strong> {content.subject}
        </div>
        <div
          style={{ background: '#ffffff', borderRadius: '12px', padding: '12px' }}
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      </div>
    </div>
  );
}
