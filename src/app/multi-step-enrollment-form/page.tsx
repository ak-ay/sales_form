import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import EnrollmentFormInteractive from './components/EnrollmentFormInteractive';

export const metadata: Metadata = {
  title: 'Multi-Step Enrollment Form - TradeMax Academy',
  description: 'Complete your enrollment at TradeMax Academy through our intuitive multi-step form. Transform your financial future with structured trading education from industry experts.',
};

export default function MultiStepEnrollmentFormPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="bg-[linear-gradient(180deg,rgba(10,132,255,0.16),rgba(245,245,247,0.2))] py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-body mb-4">
              TradeMax Academy
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold text-foreground mb-4">
              Begin Your Trading Journey
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              Complete your enrollment in just 5 simple steps and join thousands of successful traders who transformed their financial future with TradeMax Academy
            </p>
          </div>
        </div>
        <EnrollmentFormInteractive />
      </div>
    </main>
  );
}
