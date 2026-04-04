import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { L } from "@/lib/locale-utils";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export default function SupportPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">Purchase Support</p>
          </ScrollFadeIn>
          <ScrollFadeIn delay={200}>
            <h1 className="text-2xl md:text-4xl font-light text-gray-900 leading-relaxed mb-10">
              {L(locale,
                "语言不通？手续复杂？\n我们替您搞定一切。",
                "海外のお客様の空き家購入を、\n日本語でサポートします。",
                "Language barriers? Complex procedures?\nWe handle everything for you."
              )}
            </h1>
          </ScrollFadeIn>
          <ScrollFadeIn delay={400}>
            <div className="text-base md:text-lg text-gray-500 leading-loose whitespace-pre-line max-w-2xl">
              {L(locale,
                "日本空置房的购买手续全部以日语进行，\n对于海外买家来说是一道巨大的壁垒。\n\n我们提供从价格谈判到文件翻译的全方位支持，\n让您在母语环境下安心完成购房。\n\n对应方式：邮件（中文・英文・日文）",
                "空き家の購入手続きは日本語のみで行われるため、\n海外の方にとって大きな壁となっています。\n\nAKIYAでは、海外のお客様に代わって\n自治体との連絡・書類翻訳・価格交渉を代行します。\n\n対応方法：メール（中国語・英語・日本語）",
                "Purchasing an akiya in Japan requires navigating\nJapanese-only procedures and documentation.\n\nWe handle negotiations, paperwork,\nand communication — so you can buy with confidence.\n\nCommunication: Email (Chinese, English, Japanese)"
              )}
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Services 01-05 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">Service</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-14">
              {L(locale, "支持内容", "サポート内容", "What's included")}
            </h2>
          </ScrollFadeIn>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: L(locale, "价格谈判代行", "価格交渉の代行", "Price negotiation"),
                desc: L(locale,
                  "我们代替您与自治体或卖方进行价格谈判，帮您争取最优价格。",
                  "海外のお客様に代わり、自治体や売主との価格交渉を行います。",
                  "We negotiate with municipalities and sellers on your behalf to get you the best deal."
                ),
              },
              {
                num: "02",
                title: L(locale, "自治体沟通代行", "自治体との連絡代行", "Municipality liaison"),
                desc: L(locale,
                  "日本的自治体通常只接受日语沟通。我们代替您完成所有咨询、申请和文件提交。",
                  "日本語のみ対応の自治体に代わって、お問い合わせ・申請・書類提出を行います。",
                  "Japanese municipalities typically only communicate in Japanese. We handle all inquiries, applications, and submissions."
                ),
              },
              {
                num: "03",
                title: L(locale, "文件翻译", "書類の翻訳", "Document translation"),
                desc: L(locale,
                  "购房合同、重要事项说明书等日语文件，全部翻译并详细说明。",
                  "売買契約書・重要事項説明書などの書類を、お客様の言語に翻訳します。",
                  "Purchase contracts, property disclosures, and other documents — fully translated and explained."
                ),
              },
              {
                num: "04",
                title: L(locale, "看房安排", "内覧の手配", "Viewing arrangement"),
                desc: L(locale,
                  "协调自治体或卖方，安排现场看房或线上视频看房。",
                  "自治体・売主と調整し、現地内覧またはオンライン内覧を手配します。",
                  "We coordinate with municipalities and sellers to arrange in-person or online viewings."
                ),
              },
              {
                num: "05",
                title: L(locale, "全程指导", "購入手続きサポート", "End-to-end guidance"),
                desc: L(locale,
                  "从物件选定到交付，全程指导。通过邮件随时沟通，安心购房。",
                  "物件選定から引き渡しまで、メールで全プロセスをサポートします。",
                  "From property selection to handover, we guide you through every step via email."
                ),
              },
            ].map((s, i) => (
              <ScrollFadeIn key={i} delay={i * 100}>
                <div className="flex gap-6 md:gap-10 py-6 border-b border-gray-100">
                  <p className="text-3xl font-light text-accent shrink-0 w-12">{s.num}</p>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-lg">{s.desc}</p>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">Process</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-14">
              {L(locale, "利用流程", "ご利用の流れ", "How it works")}
            </h2>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: L(locale, "选择房产", "物件を選ぶ", "Choose a property"),
                desc: L(locale,
                  "在日本空房网上浏览4,335+套房源，找到心仪的物件。",
                  "AKIYAで4,335件以上の物件から、気になる物件を見つけてください。",
                  "Browse 4,335+ listings on AkiyaFinder and find one you like."
                ),
              },
              {
                step: "2",
                title: L(locale, "发送邮件", "メールで相談", "Send us an email"),
                desc: L(locale,
                  "通过邮件告诉我们您感兴趣的物件和需求。",
                  "気になる物件と、ご希望の条件をメールでお知らせください。",
                  "Email us about the property you're interested in and your requirements."
                ),
              },
              {
                step: "3",
                title: L(locale, "我们代行", "代行開始", "We take over"),
                desc: L(locale,
                  "我们替您与自治体沟通、谈判、翻译文件。进度随时通过邮件报告。",
                  "自治体との連絡・交渉・翻訳を代行。進捗はメールで随時ご報告します。",
                  "We handle communication, negotiation, and translation. Progress updates via email."
                ),
              },
              {
                step: "4",
                title: L(locale, "安心购入", "購入完了", "Purchase complete"),
                desc: L(locale,
                  "全程透明，安心完成购房。",
                  "全プロセス透明。安心してお取引いただけます。",
                  "Full transparency throughout. Buy with confidence."
                ),
              },
            ].map((item, i) => (
              <ScrollFadeIn key={i} delay={i * 150}>
                <div>
                  <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-accent font-light text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-14">
              {L(locale, "常见问题", "よくある質問", "Frequently asked questions")}
            </h2>
          </ScrollFadeIn>

          <div className="space-y-8 max-w-2xl">
            {[
              {
                q: L(locale, "费用是多少？", "費用はいくらですか？", "How much does it cost?"),
                a: L(locale,
                  "费用因物件和地区而异。请通过邮件联系我们，获取具体报价。",
                  "物件や地域によって異なります。まずはメールでお問い合わせください。",
                  "Fees vary by property and region. Contact us by email for a quote."
                ),
              },
              {
                q: L(locale, "沟通方式是什么？", "連絡方法は？", "How do we communicate?"),
                a: L(locale,
                  "全程通过邮件沟通（中文・英文・日文对应）。我们会在2个工作日内回复。",
                  "メールでのやり取りとなります（中国語・英語・日本語対応）。2営業日以内にご返信します。",
                  "All communication is via email (Chinese, English, Japanese). We respond within 2 business days."
                ),
              },
              {
                q: L(locale, "你们是不动产公司吗？", "不動産会社ですか？", "Are you a real estate agency?"),
                a: L(locale,
                  "不是。我们提供的是翻译・沟通代行・咨询服务。实际的买卖合同由持牌的日本不动产公司处理。",
                  "いいえ。翻訳・連絡代行・コンサルティングサービスです。売買契約は提携する宅建業者が担当します。",
                  "No. We provide translation, communication coordination, and consulting. Purchase contracts are handled by licensed Japanese agents."
                ),
              },
              {
                q: L(locale, "可以远程完成吗？", "リモートで完結できますか？", "Can everything be done remotely?"),
                a: L(locale,
                  "大部分手续可以远程完成。看房可通过视频进行。最终的产权登记可能需要委托书（我们会协助准备）。",
                  "ほとんどの手続きはリモートで完結可能です。内覧はビデオ通話で対応。所有権登記には委任状が必要な場合があります（準備をサポートします）。",
                  "Most procedures can be completed remotely. Viewings can be done via video. Ownership registration may require a power of attorney (we'll help prepare it)."
                ),
              },
              {
                q: L(locale, "需要多长时间？", "どのくらい時間がかかりますか？", "How long does it take?"),
                a: L(locale,
                  "从申请到完成购买，通常需要1-3个月。自治体的处理速度因地区而异。",
                  "お申し込みから購入完了まで、通常1〜3ヶ月です。処理速度は地域によって異なります。",
                  "From application to purchase completion, typically 1–3 months. Processing speed varies by municipality."
                ),
              },
              {
                q: L(locale, "为什么有0日元（免费）的房子？", "なぜ無料（0円）の物件があるのですか？", "Why are some houses free ($0)?"),
                a: L(locale,
                  "持有空房对业主来说是负担。即使不使用，每年也需缴纳固定资产税（约1～5万日元/年）。放置不管可能被认定为「特定空房」，税额最高增加6倍。拆除也需100～300万日元。因此免费转让比继续持有更经济。购买前请务必了解固定资产税和修缮费用等持续成本。",
                  "空き家は使わなくても固定資産税（年1〜5万円）がかかり、放置すると「特定空家」に指定され税額が最大6倍になります。解体にも100〜300万円かかるため、無料で譲渡した方が経済的です。購入を検討される際は、固定資産税や修繕費などの維持コストを事前にご確認ください。",
                  "Owners pay annual property tax (¥10,000–50,000/year) even on unused houses. If neglected, the tax can increase up to 6x. Demolition costs ¥1–3 million. Giving away is cheaper than keeping. Before purchasing, factor in ongoing costs like property tax and maintenance."
                ),
              },
            ].map((item, i) => (
              <ScrollFadeIn key={i} delay={i * 100}>
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <ScrollFadeIn>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
              {L(locale,
                "让购房变得简单",
                "海外のお客様の空き家購入を支援します",
                "Make buying an akiya simple"
              )}
            </h2>
            <p className="text-gray-500 mb-2">
              {L(locale,
                "先浏览房源，找到心仪的物件后，随时联系我们。",
                "まずは物件を探して、気になる物件が見つかったらご連絡ください。",
                "Browse properties first. When you find one you like, reach out to us."
              )}
            </p>
            <p className="text-sm text-gray-400 mb-8">
              helongzhi57@gmail.com
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties"
                className="inline-block text-gray-600 hover:text-gray-900 text-sm tracking-[0.2em] uppercase border-b border-gray-400 hover:border-gray-900 pb-1 transition"
              >
                {L(locale, "浏览房源 →", "物件を探す →", "Browse properties →")}
              </Link>
              <a
                href="mailto:helongzhi57@gmail.com"
                className="inline-block text-accent hover:text-red-700 text-sm tracking-[0.2em] uppercase border-b border-accent/40 hover:border-red-700 pb-1 transition"
              >
                {L(locale, "发送邮件咨询 →", "メールで相談する →", "Email us →")}
              </a>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
