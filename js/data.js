/* ============================================
   GRIMOIRE PORTFOLIO — DATA
   Shape:
     owner   — name, title, linkedin, domain
     intro   — welcome copy (one string, HTML allowed)
     about   — author bio (array of paragraphs, HTML allowed)
     projects[]:
       title       string
       campaign?   string   (creative tagline / subtitle)
       badge?      'pinned' | 'recent'
       tags        string[]
       description string   (what the campaign was — third person)
       role?       string   (what Robby did — first person, optional)
       awards?     string[]
       media       { type: 'video'|'image'|'glyph', src, textStyle?, alt? }
       cta?        { type: 'external'|'instagram', url, label? }
   ============================================ */
const SITE_DATA = {
  owner: {
    name: "Robby Sawicki",
    title: "Media Sales & OOH Specialist | Wildposting Campaigns",
    linkedin: "https://www.linkedin.com/in/robbysawicki/",
    domain: "robbysawicki.com"
  },

  intro: `Welcome to my website. I'm a Toronto-based marketing and media professional with a passion for bold brand work, street-level campaigns, and connecting ideas to audiences. Feel free to explore my projects or connect with me on LinkedIn.`,

  about: [
    `I'm a results-driven marketing professional based in Toronto with over 3 years of experience spanning media planning, OOH advertising, and account management. Currently an <strong>Account Executive at Grassroots Advertising Inc.</strong>, where I work with brands and agencies to execute high-impact Wildposting\u00AE and out-of-home campaigns across Canada \u2014 from street-level wildpostings and guerrilla sampling to murals, experiential activations, and scent marketing.`,
    `Prior to Grassroots, I spent over 2 years at <strong>dentsu</strong> as a Media Planner (and before that, Assistant Media Planner), managing national media strategy and buying for <strong>Kraft Heinz</strong> \u2014 one of the world's largest food & beverage companies. There I developed deep expertise in competitive analysis, media mix planning, and translating marketing objectives into measurable campaign results.`,
    `I hold a <strong>Bachelor of Commerce in Marketing</strong> from Toronto Metropolitan University, where I also served as Co-Head of the Rugby Club. My skill set spans marketing strategy, OOH media sales, project management, and social media measurement \u2014 and I thrive in fast-paced, creative environments where big ideas meet real-world execution.`
  ],

  projects: [
    {
      title: "Kraft Heinz x Deadpool & Wolverine",
      campaign: "\u201CCan\u2019t Unsee It\u201D",
      badge: "pinned",
      tags: ["Media Planning", "Brand Partnership", "dentsu", "Award-Winning"],
      media: { type: "video", src: "eN2rNIgy9JQ", alt: "Heinz x Deadpool \u201CCan\u2019t Unsee It\u201D" },
      description: `One of the most talked-about brand campaigns of 2024. Heinz leveraged the global release of <strong>Marvel's Deadpool & Wolverine</strong> by pointing out the obvious: Deadpool's red suit = Heinz Ketchup. Wolverine's yellow suit = Heinz Mustard. The campaign launched under the hashtag <strong>#NowYouCantUnseeit</strong> \u2014 and the internet agreed. The creative was developed by <strong>Rethink (Toronto)</strong> and became one of the most awarded campaigns of 2024\u20132025.`,
      role: `As the Media Planner on the Kraft Heinz account at dentsu, I contributed to the media strategy and planning that supported this campaign \u2014 including channel selection, audience targeting, and coordinating media buys to ensure the creative reached maximum scale during the film's peak theatrical window in Summer 2024.`,
      awards: [
        "Cannes Lions 2025: Gold Lion (Media) \u2022 Silver Lion (Entertainment)",
        "D&AD 2025: Graphite Pencil (Media/Integrated) \u2022 2\u00D7 Wood Pencil",
        "The One Show 2025: Bronze Pencil \u2022 Merit Award",
        "Strategy Marketing Awards: Gold",
        "ADCC Awards 2025: 2\u00D7 Gold (Out of Home & Cinema)"
      ]
    },
    {
      title: "Canada Soccer \u2014 \u201COur Game Now\u201D Jersey Swap",
      badge: "recent",
      tags: ["OOH", "Experiential", "Grassroots Advertising"],
      media: { type: "video", src: "95c8gQzsLA0", alt: "Canada Soccer jersey swap event" },
      description: `Ahead of the 2026 FIFA World Cup, Canada Soccer hosted a jersey swap event outside Caf\u00E9 Diplomatico in Toronto's Little Italy on April 4, 2026. Hundreds of Italian-Canadian fans lined up to trade their Italy jerseys for Canada's new "Our Game Now" 2026 World Cup kits. In a surprise twist, Canada Soccer didn't take any Italy jerseys \u2014 instead giving away free 2026 jerseys and posters to all attendees. The event drew massive crowds and generated widespread media coverage from CP24, TSN, Toronto Star, and 6ixBuzzTV, trending across social media with over 10K engagements.`
    },
    {
      title: "KD \u2014 Frozen Launch",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "video", src: "AIw0Ck1Ywlk", alt: "KD Frozen launch campaign" },
      description: `KD Frozen (2024) brought the iconic Kraft Dinner brand into the frozen aisle for the first time. The ready-to-heat frozen mac and cheese entr\u00E9es were introduced across Canadian grocery retailers including Sobeys, FreshCo, and Safeway. The media plan drove awareness of the new product format through digital advertising, in-store activations, and social content, positioning KD Frozen as a convenient, premium option for consumers seeking the classic KD taste in a quick, heat-and-eat format.`,
      role: `As a Media Planner at dentsu (Carat), I supported the media strategy for the launch.`
    },
    {
      title: "Philadelphia Cream Cheese \u2014 \u201CBonuts\u201D",
      tags: ["Media Planning", "Kraft Heinz", "dentsu", "2024"],
      media: { type: "glyph", src: "\uD83C\uDF69" },
      description: `Philadelphia launched <strong>\u201CBonuts\u201D</strong> \u2014 cream cheese filled bagel-donut hybrids \u2014 as a limited-edition product innovation that merged two beloved breakfast items into one shareable treat. The campaign leaned into food culture and social media trends to generate organic buzz and trial.`,
      role: `Contributed to the media planning and channel strategy supporting this product launch, helping to coordinate digital and social activations to maximize awareness and drive consumer excitement.`
    },
    {
      title: "KD \u2014 \u201CSpoon KD\u201D",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "glyph", src: "\uD83E\uDD44" },
      description: `In a playful nod to the timeless fork vs. spoon debate, KD launched "Spoon KD" \u2014 positioning the spoon as the definitive utensil for eating Kraft Dinner. After over 50 years with a fork on the box, the campaign introduced the spoon front and center, sparking conversation and engagement across social media, digital placements, and in-store activations.`,
      role: `As a Media Planner at dentsu (Carat), I contributed to the media strategy for KD's "Spoon KD" campaign (2023).`,
      cta: {
        type: "external",
        url: "https://strategyonline.ca/2023/03/06/kd-creates-a-new-box-for-people-who-eat-it-with-a-spoon/",
        label: "Read on Strategy"
      }
    },
    {
      title: "Kraft Hockeyville",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "image", src: "https://img.youtube.com/vi/Rf-aH6Cel64/hqdefault.jpg", alt: "Kraft Hockeyville 2024" },
      description: `Kraft Hockeyville 2024 is Kraft Heinz's iconic annual competition celebrating the role of local hockey arenas in Canadian communities. Partnering with the NHL and NHLPA, the campaign invited communities across Canada to nominate their arena for a chance to win $250,000 in upgrades and an NHL pre-season game. Elliot Lake, Ontario was crowned the 2024 winner. The fully integrated media plan included linear TV integrations during hockey programming, high-impact digital placements, social media outreach, and national OOH to drive nominations and community voting.`,
      role: `As a Media Planner at dentsu (Carat), I supported the national media plan for Kraft Hockeyville 2024.`
    },
    {
      title: "Heinz Ketchup \u2014 \u201CSmack For Heinz\u201D",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "video", src: "UTPchTpqNHU", alt: "Heinz \u201CSmack For Heinz\u201D campaign" },
      description: `The "Smack For Heinz" interactive OOH activation (2024) placed ketchup-dispensing billboards outside famous Chicago hot dog stands and restaurants known for not serving Heinz. Fans could "smack" the billboard to receive a free Heinz ketchup packet, turning the classic physical act of tapping a bottle into a digital-physical experience. The campaign generated 366 million earned impressions, helped drive $8.4 million in new restaurant business, and outperformed social benchmarks by 157%.`,
      role: `As a Media Planner at dentsu (Carat), I supported the media strategy for the campaign.`,
      awards: [
        "Strategy Agency of the Year 2024 \u2014 Winner",
        "The One Club (ADC Awards) \u2014 Merit"
      ]
    },
    {
      title: "Philadelphia Cream Cheese \u2014 \u201CIrresistibly Fluffy\u201D",
      tags: ["Media Planning", "Kraft Heinz", "dentsu", "2024"],
      media: { type: "glyph", src: "\u2601\uFE0F" },
      description: `A campaign focused on repositioning <strong>Philly Whipped cream cheese</strong> as the ideal \u201Ceasy to serve\u201D dip for snacking. The \u201CIrresistibly Fluffy\u201D creative highlighted the unique light texture of the product, shifting consumer perception away from traditional bagel-and-toast use cases toward a broader snacking occasion.`,
      role: `Supported the media planning for this repositioning effort, helping to identify the right channels and audiences to communicate the new snacking positioning and drive product trial across Canada.`
    },
    {
      title: "Heinz Ketchup \u2014 \u201CThe Wait\u201D",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "video", src: "YeFD2CVDijE", alt: "Heinz \u201CThe Wait\u201D campaign" },
      description: `Heinz's global "The Wait" campaign (January 2024) was based on research showing that over two-thirds of diners prefer waiting for Heinz ketchup rather than eating without it. The campaign celebrated this "irrational love" through 15-second film spots, social media content on Instagram and TikTok, print ads, and high-traffic digital out-of-home placements. It ran across Canada, the U.S., UK, Brazil, Chile, France, and the UAE as part of the broader "It Has To Be Heinz" brand platform.`,
      role: `As a Media Planner at dentsu (Carat), I contributed to the media strategy.`
    },
    {
      title: "KD \u2014 \u201CCancel Coverage\u201D",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "glyph", src: "\uD83D\uDCAB" },
      description: `KD's "Cancel Coverage" campaign (2023) tapped into Gen Z's embrace of JOMO (Joy Of Missing Out): KD created a fund to pay restaurant cancellation fees for consumers who chose to stay in with a box of KD instead of going out. The campaign was activated through social media, digital placements, and influencer content, positioning KD as the ultimate comfort food for nights in and resonating strongly with younger audiences who value authenticity over appearances.`,
      role: `As a Media Planner at dentsu (Carat), I contributed to the media strategy for the campaign.`,
      cta: {
        type: "instagram",
        url: "https://www.instagram.com/p/Cx75dxUN28R/"
      }
    },
    {
      title: "Philadelphia Cream Cheese \u2014 \u201CSchmear Socks\u201D",
      tags: ["Media Planning", "Kraft Heinz", "dentsu", "2023"],
      media: { type: "glyph", src: "\uD83E\uDDE6" },
      description: `To combat falling popularity among younger consumers, Philadelphia hijacked the launch of Nike's <strong>\u201CMontreal Bagel Dunks\u201D</strong> sneakers by releasing limited-edition, cream-cheese-themed socks with digital creator partnerships. The bold culture-jacking stunt drove a <strong>15.3% sales increase</strong> and brought Philly back into the conversation with a new generation.`,
      role: `Supported the media strategy for this campaign on the Kraft Heinz account, helping plan digital and social placements to amplify the cultural moment and maximize reach among the target youth demographic.`
    },
    {
      title: "Philadelphia Cream Cheese \u2014 \u201CA Little Taste of Hell\u201D",
      tags: ["Media Planning", "Kraft Heinz", "dentsu", "2023"],
      media: { type: "glyph", src: "\uD83D\uDD25" },
      description: `Philadelphia targeted a new generation by introducing a limited-edition cream cheese that was <strong>208\u00D7 hotter than jalape\u00F1os</strong>. Featuring a \u201Cdevil-horned\u201D logo and bold black packaging, the product was sold exclusively through <strong>Uber Eats</strong>, bringing a \u201Clittle taste of hell\u201D to the brand and generating massive buzz on social media.`,
      role: `Contributed to the media strategy and channel planning that supported this product launch, coordinating digital placements and partnership activations to drive awareness and trial among younger audiences.`
    },
    {
      title: "KD \u2014 \u201CGotta Be KD\u201D Brand Refresh",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "glyph", src: "KD", textStyle: true },
      description: `Kraft Dinner's major brand refresh in September 2023 was the most significant rebrand in the product's history. The "Gotta Be KD" platform featured a redesigned logo, simplified packaging, and a youth-focused positioning targeting Gen Z and Millennials. The media plan encompassed high-engagement digital placements, influencer partnerships, out-of-home advertising, and TikTok-first social content to reposition KD as a cultural staple of authenticity and social comfort.`,
      role: `As a Media Planner at dentsu (Carat), I supported the media strategy for the refresh.`
    },
    {
      title: "Heinz Ketchup \u2014 \u201CKetchup Fraud\u201D",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "video", src: "8LmaGGBSdLw", alt: "Heinz \u201CKetchup Fraud\u201D campaign" },
      description: `Heinz's "Ketchup Fraud" campaign (2023) exposed restaurants secretly refilling iconic Heinz glass bottles with inferior, generic ketchup. Using surveillance-style imagery across large-scale out-of-home placements, print ads, and digital channels, the 360-degree campaign reinforced Heinz's "It Has To Be Heinz" brand positioning. Consumers were encouraged to report offending restaurants, driving massive engagement and earned media. The campaign led to 33 new business accounts, an 8% sales increase, and a 0.6% market share gain.`,
      role: `As a Media Planner at dentsu (Carat), I supported the media strategy.`,
      awards: [
        "Cannes Lions 2023 \u2014 Gold",
        "The One Show 2024 \u2014 4 Awards",
        "ADCC Awards \u2014 Gold",
        "Epica Awards \u2014 Gold",
        "D&AD \u2014 Graphite Pencil"
      ]
    },
    {
      title: "Lunchables \u2014 \u201CGoodbye/Hello\u201D",
      tags: ["Media Planning", "Kraft Heinz", "dentsu", "2024"],
      media: { type: "glyph", src: "\uD83E\uDD6A" },
      description: `In April 2024, Kraft Heinz marked the return of <strong>Lunchables to Canadian shelves after a 15-year absence</strong> with the nostalgia-driven \u201CGoodbye/Hello\u201D campaign. The two-part creative \u2014 featuring a press conference-style video titled \u201CGoodbye, Canada\u201D followed by the reveal \u2014 leveraged irony and nostalgia to reintroduce the iconic snack brand to a new generation of Canadian families, including a giveaway of <strong>10,000 free samples</strong>.`,
      role: `Contributed to the media planning and strategy supporting the Canadian relaunch of Lunchables, helping coordinate channel selection and media buys to maximize awareness and excitement around the brand's highly anticipated return to market.`
    },
    {
      title: "Tingly Ted\u2019s \u2014 Ed Sheeran x Kraft Heinz",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "video", src: "s5rKHbyFcVM", alt: "Tingly Ted\u2019s campaign" },
      description: `Tingly Ted's is a hot sauce brand launched in 2023 through a collaboration between Ed Sheeran and Kraft Heinz. Named after Sheeran's childhood teddy bear, the "bland-busting" condiment launched in "Tingly" and "Xtra Tingly" flavors. The integrated campaign, titled "Catchup with Tingly Ted," featured TV spots, social video content across TikTok, Instagram, and YouTube, and outdoor advertising, starring Sheeran alongside a giant teddy bear mascot.`,
      role: `As a Media Planner at dentsu (Carat), I supported the media strategy for the launch.`
    },
    {
      title: "Kraft Peanut Butter \u2014 \u201CQJar Codes\u201D",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "glyph", src: "\uD83E\uDD5C" },
      description: `Kraft Peanut Butter's "QJar Codes" campaign (2024) combated rising grocery prices with an innovative AI-driven activation: it turned the residue left inside empty Kraft Peanut Butter jars into scannable QR codes, unlocking instant delivery of a new jar via SkipTheDishes. The campaign drove a 120% increase in sales during the campaign period. The media strategy included high-traffic OOH placements at Toronto's Yonge-Dundas Square, TV spots, and social media activations across Instagram and TikTok.`,
      role: `As a Media Planner at dentsu (Carat), I contributed to the media strategy.`,
      awards: [
        "Strategy Marketing Awards 2024 \u2014 2\u00D7 Bronze"
      ]
    },
    {
      title: "MiO Energy \u2014 Influencer Campaign",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "glyph", src: "\u26A1" },
      description: `MiO Energy's influencer-driven campaign (2023\u20132024) leveraged creators on TikTok and Instagram to promote MiO Energy's product line to a younger, digitally-native audience. Key activations included the "Another Busy Morning" influencer series and "Squeeze" productivity content, focusing on themes of staying hydrated and energized. The media plan targeted high-impact digital placements and social-first content partnerships to drive awareness around MiO's rebranded energy line.`,
      role: `As a Media Planner at dentsu (Carat), I contributed to the media strategy.`
    },
    {
      title: "Kraft Peanut Butter \u2014 \u201CWelcome Home Jars\u201D",
      tags: ["Media Planning", "Kraft Heinz"],
      media: { type: "image", src: "https://img.youtube.com/vi/o-n_GmEu4OA/hqdefault.jpg", alt: "Kraft Peanut Butter Welcome Home Jars" },
      description: `Kraft Peanut Butter's "Welcome Home Jars" campaign (2023) welcomed newcomers to Canada. Partnering with Duolingo and featuring Nav Bhatia, the campaign replaced jar labels with welcome messages in five languages and included custom language resources and real-time interactive airport billboards. All limited-edition jars were claimed within hours of launch. The integrated media plan spanned contextually relevant OOH placements, social, and digital channels.`,
      role: `As a Media Planner at dentsu (Carat), I supported the media strategy.`,
      awards: [
        "Strategy Marketing Awards 2024 \u2014 Bronze (Integrated Campaign)"
      ]
    }
  ]
};
