import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../../payload.config';

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const seqLib = await import('@/lib/email-sequences');
    const toImport: any[] = [];

    const pushSeq = (arr: any[], namePrefix: string, segment: string) => {
      arr.forEach((step: any, idx: number) => {
        const html = step.template?.('{{name}}', {})?.html || '';
        toImport.push({
          name: `${namePrefix} - Day ${step.day}`,
          segment,
          delayMinutes: step.day * 1440,
          subject: step.subject,
          body: html,
          active: true,
        });
      });
    };

    pushSeq(seqLib.highIntentSequence, 'High Intent', 'hot');
    pushSeq(seqLib.duiSpecificSequence, 'DUI Specific', 'hot');
    if (seqLib.upgradeSequences) {
      pushSeq(seqLib.upgradeSequences.diyToReview ?? [], 'DIY ➜ Review', 'warm');
      pushSeq(seqLib.upgradeSequences.reviewToFull ?? [], 'Review ➜ Full', 'customers');
    }

    const created = [] as string[];
    for (const seq of toImport) {
      // check duplicate by name
      const existing = await payload.find({ collection: 'email_sequences', where: { name: { equals: seq.name } }, limit:1 });
      if (existing.docs.length === 0) {
        const doc = await payload.create({ collection: 'email_sequences', data: seq });
        created.push(doc.id);
      }
    }

    return NextResponse.json({ success: true, imported: created.length });
  } catch (error) {
    console.error('Import sequences error', error);
    return NextResponse.json({ success:false, error:'failed' }, {status:500});
  }
} 