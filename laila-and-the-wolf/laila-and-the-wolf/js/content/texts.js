import { AR } from '../core/config.js';

const ORD = {
  ar: ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'],
  en: ['one', 'two', 'three', 'four', 'five', 'six'],
};
export const C2 = (ar, en) => ({ ar, en });
export const CARDS = {
  laila_walk: C2(
    ['ليلى', 'في العاشرة، لا تخلع قبّعتها الحمراء أبداً. خاطتها جدّتها من *شالٍ قديم*.'],
    ['Laila', 'Ten years old and never without her red hood. Grandma sewed it from an *old shawl*.']
  ),
  mother: C2(
    ['أمّ ليلى', 'خبّازة القرية. لا تثق بالغابة، ولهذا دسّت في جيب ليلى *ستة شرائط حمراء*.'],
    [
      "Laila's mother",
      'The village baker. She does not trust the woods, so she slipped *six red ribbons* into Laila’s pocket.',
    ]
  ),
  basket: C2(
    ['السلّة', 'خبز ساخن، جرّة عسل، وتفّاحتان. *رائحة الخبز* هي ما لفت أنف الذئب أولاً.'],
    [
      'The basket',
      'Warm bread, a jar of honey, two apples. The *smell of bread* is what caught the wolf’s nose.',
    ]
  ),
  cat: C2(
    ['مشمش القطّ', 'يرافق ليلى حتى البوّابة ثم يعود. القطط تعرف *أين تبدأ المغامرات*.'],
    ['Apricot the cat', 'Walks Laila to the gate, then turns back. Cats know *where adventures begin*.']
  ),
  wolf: C2(
    ['الذئب', 'صوتٌ ناعم، كلامٌ حلو، وجوعٌ *شديد*. لا تصدّق ابتسامته.'],
    ['The wolf', 'Soft voice, sweet words, and *very* hungry. Never trust that smile.']
  ),
  signpost: C2(
    ['اللافتة', 'يمين: بيت الجدّة. يسار: المرج. والذئب يعرف *طريقاً ثالثاً*.'],
    ['The signpost', 'Right: Grandma’s. Left: the meadow. The wolf knows *a third way*.']
  ),
  owl: C2(
    ['البومة', 'رأت كل شيء من فوق. لو كانت البوم تتكلّم *لأنقذت الجميع* مبكراً.'],
    ['The owl', 'Saw everything from above. If owls could talk, she’d have *saved everyone* early.']
  ),
  wolfrun: C2(
    ['الطريق المختصر', 'بينما تقطف ليلى الأزهار، يركض الذئب *بين الأشجار* نحو بيت الجدّة.'],
    ['The shortcut', 'While Laila picks flowers, the wolf dashes *through the trees* to Grandma’s.']
  ),
  laila_pick: C2(
    ['باقة للجدّة', 'قطفت ليلى سبع زهرات… ثم لاحظت أن *الذئب اختفى*. ولم يعجبها ذلك.'],
    [
      'Flowers for Grandma',
      'Laila picked seven flowers… then noticed *the wolf was gone*. She did not like that.',
    ]
  ),
  deer: C2(
    ['الغزالة', 'هربت حين مرّ الذئب. الحيوانات تعرف *قبل الناس* دائماً.'],
    ['The deer', 'Bolted when the wolf went by. Animals always know *before people do*.']
  ),
  cottage: C2(
    ['بيت الجدّة', 'في آخر الدرب، بسقفٍ من القشّ ومدخنةٍ لا تنطفئ. *الباب لا يُقفل*… حتى اليوم.'],
    [
      "Grandma's cottage",
      'End of the path, a thatched roof, a chimney that never goes out. *The door is never locked*… until today.',
    ]
  ),
  wolf_knock: C2(
    ['طق، طق', 'قلّد الذئب صوت ليلى ببراعة، لكنه *نسي أن يخفي ذيله*.'],
    ['Knock, knock', 'The wolf copied Laila’s voice rather well, but *forgot to hide his tail*.']
  ),
  wolfbed: C2(
    ['الجدّة… أم لا؟', 'قبّعة نوم، نظّارة مقلوبة، و*أسنانٌ كثيرة جداً* بالنسبة لجدّة.'],
    ['Grandma… or not?', 'A nightcap, glasses on upside down, and *far too many teeth* for a grandma.']
  ),
  wardrobe: C2(
    ['الخزانة', 'من الشقّ تلمع *نظّارة الجدّة*. إنها تنتظر اللحظة المناسبة.'],
    ['The wardrobe', 'Through the crack, *Grandma’s glasses* glint. She is waiting for the right moment.']
  ),
  laila_scared: C2(
    ['«ما أكبر أسنانكِ!»', 'عرفت ليلى الحقيقة من السؤال الأول، لكنها *أطالت الحديث* لتكسب الوقت.'],
    ['“What big teeth!”', 'Laila knew from the very first question. She *kept him talking* to buy time.']
  ),
  candle: C2(
    ['الشمعة', 'الضوء الوحيد في الغرفة. ظلّ الذئب على الجدار *أكبر من الذئب نفسه*.'],
    ['The candle', 'The only light in the room. The wolf’s shadow is *bigger than the wolf*.']
  ),
  woodcutter: C2(
    ['أبو ليلى الحطّاب', 'تبع الشرائط الحمراء *واحداً واحداً*، من البوّابة حتى هذا الباب.'],
    ['Father, the woodcutter', 'He followed the red ribbons *one by one*, from the gate to this door.']
  ),
  grandma_pin: C2(
    ['الجدّة', 'لا تحتاج من ينقذها. *الشوبك* يكفي.'],
    ['Grandma', 'Does not need rescuing. *The rolling pin* will do.']
  ),
  laila_happy: C2(
    ['النهاية السعيدة', 'شاي وكعكة عسل للجميع. ووعدت ليلى ألّا تكلّم الغرباء… *إلا عند الضرورة*.'],
    [
      'A happy ending',
      'Tea and honey cake all round. Laila promised never to talk to strangers… *unless she has to*.',
    ]
  ),
  wolfflee: C2(
    ['وداعاً أيها الذئب', 'قفز من النافذة ولم يره أحد بعدها. يقولون إنه صار *نباتياً*.'],
    ['Goodbye, wolf', 'Out of the window and never seen again. Some say he became a *vegetarian*.']
  ),
  cake: C2(
    ['كعكة العسل', 'من جرّة العسل نفسها التي حملتها ليلى *طوال الطريق*.'],
    ['Honey cake', 'Made from the very jar of honey Laila carried *all the way*.']
  ),
};
export const CLUECARDS = [
  C2(
    'ربطته ليلى على *بوّابة البيت*، كي يعرف أبوها من أين بدأت.',
    'Laila tied it to the *garden gate*, so her father would know where she began.'
  ),
  C2(
    'على *لافتة الدرب*، مباشرةً بعد أن رأت ذيل الذئب يهتزّ.',
    'On the *signpost*, right after she saw the wolf’s tail twitch.'
  ),
  C2(
    'على *شجيرة الورد*، بينما كان الذئب يركض نحو بيت الجدّة.',
    'On the *rose bush*, while the wolf was racing to Grandma’s.'
  ),
  C2(
    'على *السياج*. الباب كان مفتوحاً… والجدّة لا تتركه مفتوحاً أبداً.',
    'On the *fence*. The door was open… and Grandma never leaves it open.'
  ),
  C2('على *عمود السرير*، بأصابع ترتجف قليلاً.', 'On the *bedpost*, with fingers that shook just a little.'),
  C2(
    'في يد *الحطّاب*: آخر شريط. ربطته ليلى على *نافذة الجدّة*، فرآه يرفرف من بعيد.',
    'In *the woodcutter’s* hand: the last ribbon. Laila tied it to *Grandma’s window*, and he saw it fluttering from afar.'
  ),
];
export const FINAL = C2(
  [
    'تبعتَ الشرائط الستة!',
    'مثل أبي ليلى تماماً، تبعتَ الأثر الأحمر من البيت إلى باب الجدّة. ليلى لم تكن *خائفة فقط*، بل كانت *ذكيّة*: خالفت كلام أمّها مرّة، لكنها تركت طريقاً للعودة. والذئب؟ ما زال حتى اليوم *يغمض عينيه* كلما رأى شيئاً أحمر.',
  ],
  [
    'You followed all six ribbons!',
    'Just like Laila’s father, you followed the red trail from home to Grandma’s door. Laila wasn’t *only scared*, she was *clever*: she broke one rule, but she left a way back. And the wolf? To this day he *shuts his eyes* whenever he sees something red.',
  ]
);
export const LABELS = {
  laila: C2('ليلى', 'Laila'),
  mother: C2('أمّ ليلى', "Laila's mother"),
  basket: C2('السلّة', 'the basket'),
  bread: C2('خبزٌ ساخن', 'warm bread'),
  honey: C2('جرّة عسل', 'a jar of honey'),
  apple: C2('تفّاحة', 'an apple'),
  cat: C2('مشمش القطّ', 'Apricot the cat'),
  clock: C2('ساعة الحائط', 'the clock'),
  gate: C2('البوّابة', 'the gate'),
  plant: C2('نبتة', 'a plant'),
  pine: C2('صنوبرة', 'a pine'),
  oak: C2('بلّوطة', 'an oak'),
  wolf: C2('الذئب', 'the wolf'),
  signpost: C2('اللافتة', 'the signpost'),
  mushroom: C2('فطر', 'a toadstool'),
  rabbit: C2('أرنب', 'a rabbit'),
  owl: C2('بومة', 'an owl'),
  squirrel: C2('سنجاب', 'a squirrel'),
  bird: C2('عصفور', 'a robin'),
  flower: C2('زهرة', 'a flower'),
  daisy: C2('أقحوان', 'a daisy'),
  tulip: C2('توليب', 'a tulip'),
  rosebush: C2('شجيرة ورد', 'a rose bush'),
  butterfly: C2('فراشة', 'a butterfly'),
  deer: C2('غزالة', 'a deer'),
  wolfrun: C2('الذئب يركض', 'the wolf, running'),
  hedgehog: C2('قنفذ', 'a hedgehog'),
  snail: C2('حلزون', 'a snail'),
  cottage: C2('بيت الجدّة', "Grandma's cottage"),
  fence: C2('السياج', 'the fence'),
  well: C2('البئر', 'the well'),
  hen: C2('دجاجة', 'a hen'),
  wolf_knock: C2('الذئب', 'the wolf'),
  lantern: C2('فانوس', 'a lantern'),
  wolfbed: C2('«الجدّة»', '“Grandma”'),
  wardrobe: C2('الخزانة', 'the wardrobe'),
  candle: C2('شمعة', 'a candle'),
  moon: C2('القمر', 'the moon'),
  slippers: C2('خفّان', 'slippers'),
  woodcutter: C2('الحطّاب', 'the woodcutter'),
  grandma_pin: C2('الجدّة', 'Grandma'),
  wolfflee: C2('الذئب الهارب', 'the wolf, fleeing'),
  cake: C2('كعكة العسل', 'honey cake'),
  logs: C2('حطب', 'firewood'),
  teapot: C2('إبريق شاي', 'a teapot'),
};
export const UIT = {
  ar: {
    hoverOpen: 'افتح ↖',
    ribbon: 'شريطٌ أحمر',
    ribbonN: i => 'الشريط ' + ORD.ar[i],
    found: n => ` <br>وجدتَ ${AR(n)} من ٦.`,
    all: ' <br>اكتملت الشرائط! المس شريط الشرائط في الأعلى.',
    chapter: i => 'الفصل ' + ORD.ar[i],
    end: 'الخاتمة',
    folding: 'جارٍ الطيّ ',
    band: '  ✶  ليلى والذئب  ✶  كتابٌ ورقيّ دوّار في ستة فصول  ✶  حكايةٌ قديمة مطويّة من جديد',
  },
  en: {
    hoverOpen: 'open ↗',
    ribbon: 'a red ribbon',
    ribbonN: i => 'Ribbon ' + ORD.en[i],
    found: n => ` <br>You have found ${n} of 6.`,
    all: ' <br>All six found! Tap the ribbon strip at the top.',
    chapter: i => 'chapter ' + ORD.en[i],
    end: 'the end',
    folding: 'FOLDING ',
    band: 'LAILA & THE WOLF  ✶  A PAPER CAROUSEL BOOK IN SIX CHAPTERS  ✶  AN OLD TALE, FOLDED ANEW  ✶  ',
  },
};
