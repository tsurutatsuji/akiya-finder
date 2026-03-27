/**
 * 提携業者リスト
 * 問い合わせが来たとき、エリアに合った業者に紹介メールを自動送信する
 * 業者のメールアドレスは環境変数ではなくここで管理（少数のうちは十分）
 */

export interface PartnerAgent {
  id: string;
  name: string;
  email: string;
  regions: string[]; // 対応エリア（prefectureEn）
  languages: string[];
  specialties: string[];
  active: boolean;
}

// 提携が決まったら業者を追加していく
// 初期状態では空。業者と提携したらここに追加する
export const PARTNER_AGENTS: PartnerAgent[] = [
  // 例:
  // {
  //   id: "arrows",
  //   name: "Arrows International Realty",
  //   email: "info@arrowsrealty.com",
  //   regions: ["Kyoto"],
  //   languages: ["English", "Japanese"],
  //   specialties: ["Machiya", "Traditional homes"],
  //   active: true,
  // },
  // {
  //   id: "rescom",
  //   name: "ResCom Hokkaido",
  //   email: "info@rescomhokkaido.com",
  //   regions: ["Hokkaido"],
  //   languages: ["English", "Japanese"],
  //   specialties: ["Investment", "Non-resident support"],
  //   active: true,
  // },
];

/**
 * 問い合わせ内容からマッチする業者を探す
 * エリアが一致する業者を優先、なければ全エリア対応の業者
 */
export function findMatchingAgents(
  prefectureEn?: string,
  message?: string
): PartnerAgent[] {
  const active = PARTNER_AGENTS.filter((a) => a.active);
  if (active.length === 0) return [];

  // エリアマッチ
  if (prefectureEn) {
    const matched = active.filter((a) =>
      a.regions.some(
        (r) => r === prefectureEn || r === "All" || r === "*"
      )
    );
    if (matched.length > 0) return matched;
  }

  // メッセージ内のキーワードマッチ
  if (message) {
    const msg = message.toLowerCase();
    const matched = active.filter((a) =>
      a.regions.some((r) => msg.includes(r.toLowerCase()))
    );
    if (matched.length > 0) return matched;
  }

  // マッチしなければ全エリア対応を返す
  return active.filter((a) => a.regions.includes("All") || a.regions.includes("*"));
}

/**
 * 業者への紹介メール本文を生成
 */
export function generateReferralEmail(params: {
  agentName: string;
  buyerName: string;
  buyerEmail: string;
  buyerCountry: string;
  budget: string;
  message: string;
  property: string;
  refCode: string;
}): { subject: string; html: string } {
  const { agentName, buyerName, buyerEmail, buyerCountry, budget, message, property, refCode } = params;

  const subject = `[AkiyaFinder Referral] New buyer inquiry — ${refCode}`;

  const html = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a1a2e; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="margin: 0;">🏠 AkiyaFinder Referral</h2>
    <p style="margin: 5px 0 0; opacity: 0.8; font-size: 14px;">A buyer found you through AkiyaFinder.com</p>
  </div>

  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear ${agentName},</p>

    <p>We have a buyer who is interested in Japanese property and we'd like to introduce them to you.</p>

    <div style="background: #f9fafb; border-left: 4px solid #e94560; padding: 15px; margin: 15px 0; border-radius: 0 4px 4px 0;">
      <h3 style="margin: 0 0 10px; color: #1a1a2e;">Buyer Details</h3>
      <table style="font-size: 14px; border-collapse: collapse;">
        <tr><td style="padding: 3px 10px 3px 0; color: #6b7280;">Name:</td><td><strong>${buyerName}</strong></td></tr>
        <tr><td style="padding: 3px 10px 3px 0; color: #6b7280;">Email:</td><td><a href="mailto:${buyerEmail}">${buyerEmail}</a></td></tr>
        <tr><td style="padding: 3px 10px 3px 0; color: #6b7280;">Country:</td><td>${buyerCountry || 'Not specified'}</td></tr>
        <tr><td style="padding: 3px 10px 3px 0; color: #6b7280;">Budget:</td><td>${budget || 'Not specified'}</td></tr>
        ${property ? `<tr><td style="padding: 3px 10px 3px 0; color: #6b7280;">Property:</td><td>${property}</td></tr>` : ''}
        <tr><td style="padding: 3px 10px 3px 0; color: #6b7280;">Ref Code:</td><td><code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${refCode}</code></td></tr>
      </table>
    </div>

    <div style="background: #fffbeb; padding: 15px; margin: 15px 0; border-radius: 4px;">
      <p style="margin: 0 0 5px; font-weight: bold; color: #92400e;">Buyer's Message:</p>
      <p style="margin: 0; color: #78350f;">${message}</p>
    </div>

    <p>Please contact the buyer directly at <a href="mailto:${buyerEmail}">${buyerEmail}</a>.</p>

    <p style="font-size: 13px; color: #6b7280;">
      Reference code <strong>${refCode}</strong> — please include this in your communications for tracking purposes.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

    <p style="font-size: 12px; color: #9ca3af;">
      This referral was sent automatically by AkiyaFinder.com — Japan's property search platform for international buyers.
      If you have questions about this referral, please contact us at akiyafinder@gmail.com
    </p>
  </div>
</div>`;

  return { subject, html };
}
