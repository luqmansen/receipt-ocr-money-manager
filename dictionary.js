export function merge(items) {
    return items.reduce((acc, val) => acc.concat(val['items']), []);
}

//Hardcoded category according to my Money Manager configuration
const proteins = ["nötkött", "nötköttet", "oxkött", "biff", "entrecôte", "ryggbiff", "oxfilé", "fläskkött", "fläsk", "fläsket", "fläskfilé", "kotlett", "kotletter", "kyckling", "kycklingen", "kycklingar", "kycklingfilé", "kycklingbröst", "kalkon", "kalkonen", "kalkonbröst", "lamm", "lammet", "lammkött", "lammracks", "vilt", "viltet", "viltkött", "älg", "älgkött", "älgstek", "ren", "renkött", "renfilé", "hjort", "hjortkött", "hjortfilé", "kanin", "kaninkött", "anka", "ankbröst", "anklever", "gås", "gåslever", "struts", "strutsfilé", "fisk", "fisken", "fiskar", "fiskfilé", "lax", "laxen", "laxfilé", "rökt lax", "gravad lax", "torsk", "torsken", "torskfilé", "sill", "sillen", "sillfilé", "makrill", "makrillen", "tonfisk", "tonfisken", "räkor", "räkan", "skalade räkor", "krabba", "krabbkött", "krabbklor", "hummer", "hummerkött", "musslor", "blåmusslor", "bläckfisk", "bläckfiskringar", "ägg", "ägget", "äggvita", "äggula", "mjölk", "mjölken", "filmjölk", "kefir", "yoghurt", "yoghurten", "keso", "kesella", "kvarg", "ost", "osten", "ostar", "hårdost", "mjukost", "smältost", "skinka", "skinkan", "kokt skinka", "rökt skinka", "korv", "korven", "korvar", "falukorv", "prinskorv", "bacon", "sidfläsk", "leverpastej", "leverpastejen", "köttfärs", "nötfärs", "fläskfärs", "blandfärs", "revbensspjäll", "revben", "kassler", "skaldjur", "skaldjuren", "sardiner", "ansjovis", "kaviar", "kaviaren", "charkuterier", "pålägg", "salami", "lufttorkad skinka", "parmaskinka", "köttbullar", "hamburgare", "kött", "köttet", "köttbit", "köttbiten", "köttbitar", "köttbitarna", "nötkött", "nötköttet", "fläskkött", "fläskköttet", "lammkött", "lammköttet", "kalvkött", "kalvköttet", "viltkött", "viltköttet", "kyckling", "kycklingen", "kycklingbröst", "kycklingbröstet", "kycklinglår", "kycklinglåret", "kycklingvingar", "kycklingvingarna", "fisk", "fisken", "torsk", "torsken", "lax", "laxen", "sill", "sillen", "strömming", "strömmingen", "räkor", "rökta räkor", "kokta räkor", "krabba", "krabban", "krabbor", "krabborna", "musslor", "musslorna", "blåmusslor", "blåmusslorna", "ostron", "ostronen", "skaldjur", "skaldjuren", "ägg", "äggen", "äggvita", "äggvitan", "äggula", "äggulan", "korv", "korven", "korvar", "korvarna", "falukorv", "falukorven", "prinskorv", "prinskorven", "prinskorvar", "prinskorvarna", "bacon", "baconet", "skinka", "skinkan", "rökt skinka", "kokt skinka", "parmaskinka", "parmaskinkan", "lever", "levern", "leverpastej", "leverpastejen", "njure", "njuren", "njurar", "njurarna", "hjärta", "hjärtat", "hjärtan", "hjärtana", "kalkon", "kalkonen", "kalkonbröst", "kalkonbröstet", "kalkonlår", "kalkonlåret", "anka", "ankan", "ankbröst", "ankbröstet", "anklår", "anklåret", "vildsvin", "vildsvinet", "vildsvinskött", "vildsvinsköttet", "renkött", "renköttet", "älgkött", "älgköttet", "hjortkött", "hjortköttet", "fågel", "fågeln", "fågelkött", "fågelköttet", "kanin", "kaninen", "kaninkött", "kaninköttet", "gris", "grisen", "griskött", "grisköttet", "höna", "hönan", "hönakött", "hönaköttet", "färs", "färsen", "nötfärs", "nötfärsen", "fläskfärs", "fläskfärsen", "kycklingfärs", "kycklingfärsen", "lammfärs", "lammfärsen", "kalkonfärs", "kalkonfärsen", "fiskfärs", "fiskfärsen", "räkfärs", "räkfärsen", "kassler", "kasslern", "rökt kassler", "kokt kassler", "serrano", "serranon", "pepperoni", "pepperonin", "salami", "salamin", "chorizo", "chorizon", "pölsa", "pölsan", "blodpudding", "blodpuddingen", "blodkorv", "blodkorven", "blodpalt", "blodpalten", "surströmming", "surströmmingen", "gravad lax", "gravad laxen", "rökt lax", "rökt laxen", "rökt ål", "rökt ålen", "rökt skinka", "rökt skinkan", "rökt fisk", "rökt fisken", "rökt kyckling", "rökt kycklingen", "rökt ren", "rökt renen", "rökt älg", "rökt älgen", "rökt vildsvin", "rökt vildsvinet"];
const fruits = ["äpple", "äpplen", "äpplet", "äpplena", "äppel", "äpplenas", "apelsin", "apelsiner", "apelsinen", "apelsinerna", "apelsinjuice", "banan", "bananer", "bananen", "bananerna", "bananklyfta", "bananklyftor", "päron", "päronen", "päronet", "päronen", "päronjuice", "kiwi", "kiwibär", "kiwin", "kiwibären", "kiwiskiva", "kiwiskivor", "melon", "meloner", "melonen", "melonerna", "vattenmelon", "vattensmeloner", "jordgubbe", "jordgubbar", "jordgubben", "jordgubbarna", "jordgubbssylt", "hallon", "hallonen", "hallonet", "hallonen", "hallonsylt", "blåbär", "blåbären", "blåbärsylt", "blåbärspaj", "persika", "persikor", "persikan", "persikorna", "persikoklyfta", "persikoklyftor", "nektarin", "nektariner", "nektarinen", "nektarinerna", "plommon", "plommonen", "plommonet", "plommonen", "plommonmos", "vindruva", "vindruvor", "vindruvan", "vindruvorna", "vindruvsjuice", "fikon", "fikonet", "fikon", "fikonens", "fikonpasta", "ananas", "ananasen", "ananaserna", "ananasring", "ananasringar", "mango", "mangon", "mangor", "mangona", "mangoklyfta", "mangoklyftor", "papaya", "papayor", "papayan", "papayorna", "guava", "guavor", "guavan", "guavorna", "granatäpple", "granatäpplen", "granatäpplet", "granatäpplena", "körsbär", "körsbären", "körsbärsylt", "körsbärspaj", "citron", "citroner", "citronen", "citronerna", "citronsaft", "citronskiva", "citronskivor", "lime", "limer", "limen", "limerna", "limesaft", "limeskiva", "limeskivor", "aprikos", "aprikoser", "aprikosen", "aprikoserna", "aprikosklyfta", "aprikosklyftor", "kivi", "kivifrukt", "kivifrukter", "kivifrukten", "kivifrukterna", "passionsfrukt", "passionsfrukter", "passionsfrukten", "passionsfrukterna", "druva", "druvor", "druvan", "druvorna", "druvjuice", "päron", "päronen", "päronet", "päronen", "päronjuice", "rabarber", "rabarberstjälk", "rabarberstjälkar", "rabarberpaj", "klementin", "klementiner", "klementinen", "klementinerna", "mandarin", "mandariner", "mandarinen", "mandarinerna", "grapefrukt", "grapefrukter", "grapefrukten", "grapefrukterna", "krusbär", "krusbären", "krusbärssylt", "lingon", "lingonen", "lingonsylt", "lingonpaj", "tranbär", "tranbären", "tranbärsjuice", "tranbärssylt", "frukt", "frukter", "frukten", "frukterna", "fruktsallad", "fruktsaft", "fruktkorg"];
const vegetables = ["Kidneybönor", "Vitkål", "tomat", "tomater", "tomaten", "tomaterna", "gurka", "gurkor", "gurkan", "gurkorna", "morot", "morötter", "moroten", "morötterna", "potatis", "potatisar", "potatisen", "potatisarna", "lök", "lökar", "löken", "lökarna", "vitlök", "vitlökar", "vitlöken", "vitlökarna", "paprika", "paprikor", "paprikan", "paprikorna", "spenat", "spenaten", "sallad", "sallader", "salladen", "salladerna", "kål", "kålar", "kålen", "kålarna", "broccoli", "broccolin", "blomkål", "blomkålar", "blomkålen", "blomkålarna", "ärtor", "ärterna", "bönor", "bönorna", "sötpotatis", "sötpotatisar", "sötpotatisen", "sötpotatisarna", "selleri", "sellerier", "sellerin", "sellerierna", "purjolök", "purjolökar", "purjolöken", "purjolökarna", "rödbeta", "rödbetor", "rödbetan", "rödbetorna", "squash", "squashen", "zucchini", "zucchinin", "aubergine", "auberginer", "auberginen", "auberginerna", "majs", "majsen", "ärtsoppa", "ärtsoppor", "ärtsoppan", "ärtsopporna", "bönsoppa", "bönsoppor", "bönsoppan", "bönsopporna", "grönsakssoppa", "grönsakssoppor", "grönsakssoppan", "grönsakssopporna", "rotfrukter", "rotfrukterna", "kålrot", "kålrötter", "kålroten", "kålrötterna", "palsternacka", "palsternackor", "palsternackan", "palsternackorna", "raps", "rapsen", "rapsfrön", "rapsfröna", "ärtplanta", "ärtplantor", "ärtplantan", "ärtplantorna", "bönplanta", "bönplantor", "bönplantan", "bönplantorna"];

const cheese = [{
    "category": "Cheese",
    "sub_category": "Common Cheeses",
    "items": ["ost", "osten", "cheddar", "cheddaren", "brie", "brien", "camembert", "camemberten", "feta", "fetan", "mozzarella", "mozzarellan", "parmesan", "parmesanen", "gouda", "goudan", "edamer", "edamern", "emmentaler", "emmentalern", "gruyère", "gruyèren", "halloumi", "halloumin", "ricotta", "ricottan", "blåmögelost", "blåmögelosten", "getost", "getosten", "färskost", "färskosten"]
}, {
    "category": "Cheese",
    "sub_category": "Swedish Cheeses",
    "items": ["västerbottensost", "västerbottensosten", "prästost", "prästosten", "herrgårdsost", "herrgårdsosten", "grevé", "grevén", "hushållsost", "hushållsosten", "svecia", "svecian", "ädelost", "ädelosten", "messmör", "messmöret", "kvibille", "kvibillen", "falbygdensost", "falbygdensosten"]
}, {
    "category": "Cheese",
    "sub_category": "Blue Cheeses",
    "items": ["blåmögelost", "blåmögelosten", "gorgonzola", "gorgonzolan", "roquefort", "roqueforten", "stilton", "stiltonen", "danablu", "danablun", "bergader", "bergadern"]
}, {
    "category": "Cheese",
    "sub_category": "Soft Cheeses",
    "items": ["brie", "brien", "camembert", "camemberten", "feta", "fetan", "ricotta", "ricottan", "mascarpone", "mascarponeen", "cottage cheese", "cottage cheeseen", "cream cheese", "cream cheeseen", "queso fresco", "queso frescon"]
}, {
    "category": "Cheese",
    "sub_category": "Hard Cheeses",
    "items": ["parmesan", "parmesanen", "pecorino", "pecorinoen", "grana padano", "grana padanon", "manchego", "manchegon", "asiago", "asiagon", "comté", "comtén", "emmentaler", "emmentalern"]
}, {
    "category": "Cheese",
    "sub_category": "Goat & Sheep Cheeses",
    "items": ["getost", "getosten", "feta", "fetan", "halloumi", "halloumin", "pecorino", "pecorinoen", "manchego", "manchegon", "chèvre", "chèvren", "brunost", "brunosten", "valençay", "valençayn"]
}, {
    "category": "Cheese",
    "sub_category": "Flavored & Specialty Cheeses",
    "items": ["kryddost", "kryddosten", "vitlöksost", "vitlöksosten", "nötost", "nötosten", "rökost", "rökosten", "truffelost", "truffelosten", "chiliost", "chiliosten", "honungsost", "honungsosten", "nötskalsost", "nötskalsosten", "sparrisost", "sparrisosten", "svampost", "svamposten"]
}, {
    "category": "Cheese",
    "sub_category": "Regional & International Cheeses",
    "items": ["gouda", "goudan", "cheddar", "cheddaren", "brie", "brien", "camembert", "camemberten", "roquefort", "roqueforten", "gorgonzola", "gorgonzolan", "stilton", "stiltonen", "manchego", "manchegon", "feta", "fetan", "halloumi", "halloumin", "mozzarella", "mozzarellan", "parmesan", "parmesanen", "pecorino", "pecorinoen", "gruyère", "gruyèren", "emmentaler", "emmentalern", "comté", "comtén"]
}, {
    "category": "Cheese",
    "sub_category": "Other Cheeses",
    "items": ["smältost", "smältosten", "pizzeriaost", "pizzeriaosten", "gräddost", "gräddosten", "mesost", "mesosten", "kvarg", "kvargen", "keso", "keson", "filost", "filosten", "brunost", "brunosten", "messmör", "messmöret"]
}]

const snacks = ["CHOKL MANGO&PASSION", "GORGONZOLA", "KANELSNÄCKA", "chips", "chipsen", "chips", "chipsen", "potatischips", "potatischipsen", "ostbågar", "ostbågarna", "sourcream-chips", "sourcream-chipsen", "pretzels", "pretzeln", "pretzels", "pretzlarna", "saltpretzels", "saltpretzlarna", "smörpretzels", "smörpretzlarna", "popcorn", "popcornen", "popcorn", "popcornen", "smörpopcorn", "smörpopcornen", "karamellpopcorn", "karamellpopcornen", "salt popcorn", "salt popcornen", "kakor", "kakorna", "kaka", "kakan", "småkakor", "småkakorna", "chokladkakor", "chokladkakorna", "havrekakor", "havrekakorna", "pepparkakor", "pepparkakorna", "godis", "godiset", "godispåse", "godispåsen", "surt godis", "surt godiset", "sött godis", "sött godiset", "gelégodis", "gelégodiset", "lakrits", "lakritsen", "choklad", "chokladen", "chokladkaka", "chokladkakan", "chokladbit", "chokladbiten", "mörk choklad", "mörk chokladen", "mjölkchoklad", "mjölkchokladen", "nötchoklad", "nötchokladen", "chokladpraliner", "chokladpralinerna", "mandlar", "mandlarna", "mandel", "mandeln", "rostade mandlar", "rostade mandlarna", "saltade mandlar", "saltade mandlarna", "honungsmandlar", "honungsmandlarna", "jordnötter", "jordnötterna", "jordnötspåse", "jordnötspåsen", "saltade jordnötter", "saltade jordnötterna", "chilinötter", "chilinötterna", "jordnötssmör", "jordnötssmöret", "solrosfrön", "solrosfröna", "solrosfrö", "solrosfröt", "rostade solrosfrön", "rostade solrosfröna", "saltade solrosfrön", "saltade solrosfröna", "pumpafrön", "pumpafröna", "croissant", "croissanten", "croissanter", "croissantarna", "smörcroissant", "smörcroissanten", "chokladcroissant", "chokladcroissanten", "mandelcroissant", "mandelcroissanten", "muffins", "muffinsen", "muffins", "muffinsarna", "chokladmuffins", "chokladmuffinsen", "blåbärsmuffins", "blåbärsmuffinsen", "vaniljmuffins", "vaniljmuffinsen", "bananmuffins", "bananmuffinsen", "tårta", "tårtan", "tårtor", "tårtorna", "chokladtårta", "chokladtårtan", "jordgubbstårta", "jordgubbstårtan", "kladdkaka", "kladdkakan", "cheesecake", "cheesecaken", "mazarintårta", "mazarintårtan", "paj", "pajen", "pajer", "pajerna", "äppelpaj", "äppelpajen", "blåbärspaj", "blåbärspajen", "hallonpaj", "hallonpajen", "chokladpaj", "chokladpajen", "glass", "glassen", "glassar", "glassarna", "chokladglass", "chokladglassar", "vaniljglass", "vaniljglassar", "jordgubbsglass", "jordgubbsglassar", "strösselglass", "strösselglassar", "nougatglass", "nougatglassar", "frozen yogurt", "frozen yogurten", "frozen yogurtar", "frozen yogurtarna", "vanilj frozen yogurt", "vanilj frozen yogurten", "jordgubbs frozen yogurt", "jordgubbs frozen yogurten", "sorbet", "sorbeten", "sorbeter", "sorbeterna", "citronsorbet", "citronsorbeten", "hallonsorbet", "hallonsorbeten", "mangosorbet", "mangosorbeten", "passionsfruktsorbet", "passionsfruktsorbeten"]
snacks.push(...merge(cheese))


// "food-supplies" category with each sub, as generated from LLM
const staples = [{
    "category": "Pantry Staples",
    "sub_category": "Grains & Pasta",
    "items": ["ris", "risset", "quinoa", "quinoan", "pasta", "pastan", "couscous", "couscousen", "bulgur", "bulguren", "fullkornsris", "fullkornsrisset", "basmatiris", "basmatirisset", "nudlar", "nudlarna", "soba", "soban", "ramen", "ramenen", "gnocchi", "gnocchin", "polenta", "polentan", "tapioka", "tapiokan", "bönpasta", "bönpastan"]
}, {
    "category": "Pantry Staples",
    "sub_category": "Canned & Jarred Goods",
    "items": ["soppor", "sopporna", "bönor", "bönorna", "tomater", "tomaterna", "frukter", "frukterna", "kikärtor", "kikärtorna", "majs", "majsen", "ananas", "ananasen", "oliver", "oliverna", "sardiner", "sardinerna", "tonfisk", "tonfisken", "krossade tomater", "krossade tomaterna", "ärtor", "ärtorna", "linser", "linserna", "fruktsoppa", "fruktsoppan"]
}, {
    "category": "Pantry Staples",
    "sub_category": "Baking Supplies",
    "items": ["mjöl", "mjölet", "socker", "sockret", "bakpulver", "bakpulvret", "jäst", "jästen", "vaniljsocker", "vaniljsockret", "kakao", "kakaot", "bikarbonat", "bikarbonatet", "gräddningsmedel", "gräddningsmedlet", "potatismjöl", "potatismjölet", "mandelmjöl", "mandelmjölet", "havregryn", "havregrynen", "vetemjöl", "vetemjölet", "fullkornsmjöl", "fullkornsmjölet"]
}, {
    "category": "Pantry Staples",
    "sub_category": "Oils & Vinegars",
    "items": ["olivolja", "olivoljan", "kokosolja", "kokosoljan", "balsamvinäger", "balsamvinägern", "rapsolja", "rapsoljan", "solrosolja", "solrosoljan", "sesamolja", "sesamoljan", "vinäger", "vinägern", "äppelcidervinäger", "äppelcidervinägern", "truffelolja", "truffeloljan", "valnötsolja", "valnötsoljan", "linolja", "linoljan"]
}, {
    "category": "Pantry Staples",
    "sub_category": "Spices & Seasonings",
    "items": ["salt", "saltet", "peppar", "pepparn", "kryddor", "kryddorna", "kryddblandningar", "kryddblandningarna", "oregano", "oreganon", "basilika", "basilikan", "timjan", "timjanen", "rosmarin", "rosmarinen", "paprika", "paprikan", "curry", "curryn", "kanel", "kanelen", "nejlika", "nejlikan", "gurkmeja", "gurkmejan", "spiskummin", "spiskumminen"]
}, {
    "category": "Condiments & Sauces",
    "sub_category": "Sauces",
    "items": ["pastasås", "pastasåsen", "sojasås", "sojasåsen", "chilisås", "chilisåsen", "barbecuesås", "barbecuesåsen", "teriyakisås", "teriyakisåsen", "hoisinsås", "hoisinsåsen", "fisksås", "fisksåsen", "ostronsås", "ostronsåsen", "vitlökssås", "vitlökssåsen", "tomatketchup", "tomatketchupen", "aioli", "aiolin"]
}, {
    "category": "Condiments & Sauces",
    "sub_category": "Dressings & Dips",
    "items": ["ranchdressing", "ranchdressingen", "hummus", "hummusen", "guacamole", "guacamolen", "tzatziki", "tzatzikin", "salsa", "salsan", "mayonnaise", "mayonnaisen", "caesardressing", "caesardressingen", "blåmögelostsås", "blåmögelostsåsen", "räksallad", "räksalladen", "currydressing", "currydressingen"]
}, {
    "category": "Condiments & Sauces",
    "sub_category": "Pickled & Fermented",
    "items": ["inlagd gurka", "inlagda gurkor", "kimchi", "kimchin", "oliver", "oliverna", "syltlök", "syltlöken", "inlagd rödlök", "inlagda rödlökar", "surkål", "surkålen", "picklad rödbeta", "picklade rödbetor", "inlagd ägg", "inlagda ägg", "picklad ingefära", "picklad ingefäran"]
}, {
    "category": "Bulk Foods",
    "sub_category": "Dry Goods",
    "items": ["ris", "risset", "nötter", "nötterna", "kryddor", "kryddorna", "bönor", "bönorna", "linser", "linserna", "kikärtor", "kikärtorna", "fullkornspasta", "fullkornspastan", "quinoa", "quinoan", "bulgur", "bulguren", "sojabönor", "sojabönorna"]
}, {
    "category": "Bulk Foods",
    "sub_category": "Granola & Snacks",
    "items": ["trail mix", "trail mixen", "torkad frukt", "torkade frukter", "nötter", "nötterna", "frön", "fröna", "chokladbollar", "chokladbollarna", "proteinbars", "proteinbarsen", "popcorn", "popcornen", "rostade mandlar", "rostade mandlarna", "torkade bär", "torkade bären"]
}, {
    "category": "Others",
    "sub_category": "Breakfast Foods",
    "items": ["havregryn", "havregrynen", "müsli", "müslin", "flingor", "flingorna", "gröt", "gröten", "pannkaksmix", "pannkaksmixen", "smoothiepulver", "smoothiepulvret", "proteinpulver", "proteinpulvret"]
}, {
    "category": "Others",
    "sub_category": "Plant-Based Alternatives",
    "items": ["sojamjölk", "sojamjölken", "mandelmjölk", "mandelmjölken", "havremjölk", "havremjölken", "tofu", "tofun", "tempeh", "tempehen", "seitan", "seitanen", "vegansk ost", "veganka osten", "vegansk korv", "veganka korven", "vegansk smör", "veganka smöret"]
}]

const food_supplies = merge(staples)
const bread = [{
    "category": "Bakery",
    "sub_category": "Bread",
    "items": ["bröd", "skivat bröd", "skivade bröd", "artisanbröd", "artisanbrödet", "glutenfritt bröd", "glutenfria bröd", "surdegsbröd", "surdegsbrödet", "fullkornsbröd", "fullkornsbrödet", "rågbröd", "rågbrödet", "franska", "franskan", "ciabatta", "ciabattan", "focaccia", "focaccian", "baguette", "baguetten"]
}, {
    "category": "Bakery",
    "sub_category": "Tortillas & Wraps",
    "items": ["vetetortillas", "vetetortillan", "majstortillas", "majstortillan", "fullkornstortillas", "fullkornstortillan", "glutenfria tortillas", "glutenfria tortillan", "tunnbröd", "tunnbrödet", "pitabröd", "pitabrödet", "lavash", "lavashen", "naanbröd", "naanbrödet"]
}]

const beveragesSource = [{
    "category": "Beverages",
    "sub_category": "Water",
    "items": ["vatten", "vattnet", "kolsyrat vatten", "kolsyrade vattnet", "mineralvatten", "mineralvattnet", "stillastående vatten", "stillastående vattnet", "smaksatt vatten", "smaksatta vattnet", "isvatten", "isvattnet", "kallt vatten", "kalla vattnet"]
}, {
    "category": "Beverages",
    "sub_category": "Soft Drinks",
    "items": ["läsk", "läsken", "cola", "colan", "fanta", "fantan", "sprite", "spriten", "pepsi", "pepsin", "sockerdricka", "sockerdrickan", "sockervatten", "sockervattnet", "lättdryck", "lättdrycken", "sportdryck", "sportdrycken", "energidryck", "energidrycken", "tonic", "tonicen"]
}, {
    "category": "Beverages",
    "sub_category": "Juices",
    "items": ["apelsinjuice", "apelsinjuicen", "äppeljuice", "äppeljuicen", "tranbärsjuice", "tranbärsjuicen", "grapefruktjuice", "grapefruktjuicen", "multivitaminjuice", "multivitaminjuicen", "morotsjuice", "morotsjuicen", "tomatjuice", "tomatjuicen", "ananasjuice", "ananasjuicen", "mangojuice", "mangojuicen", "blandade juicer", "blandade juicerna"]
}, {
    "category": "Beverages",
    "sub_category": "Tea",
    "items": ["svart te", "svarta teet", "grönt te", "gröna teet", "krämte", "krämteet", "örtte", "örtteet", "fruktté", "frukttéet", "rooiboste", "rooibostéet", "chai", "chain", "is-te", "is-teet", "te påse", "te påsar", "lös te", "lösa teet"]
}, {
    "category": "Beverages",
    "sub_category": "Coffee",
    "items": ["kaffe", "kaffet", "bryggkaffe", "bryggkaffet", "espresso", "espresson", "instantkaffe", "instantkaffet", "kapselkaffe", "kapselkaffet", "koffeinfritt kaffe", "koffeinfria kaffet", "is-kaffe", "is-kaffet", "latte", "latten", "cappuccino", "cappuccinon", "macchiato", "macchiaton"]
}, {
    "category": "Beverages",
    "sub_category": "Dairy & Plant-Based Drinks",
    "items": ["mjölk", "mjölken", "chokladmjölk", "chokladmjölken", "jordgubbsmjölk", "jordgubbsmjölken", "mandelmjölk", "mandelmjölken", "havremjölk", "havremjölken", "sojamjölk", "sojamjölken", "kokosmjölk", "kokosmjölken", "fil", "filen", "yoghurtdrink", "yoghurtdrinken", "långfil", "långfilen", "filmjölk", "filmjölken"]
}, {
    "category": "Beverages",
    "sub_category": "Alcoholic Beverages",
    "items": ["öl", "ölet", "vin", "vinet", "rött vin", "röda vinet", "vitt vin", "vita vinet", "rosévin", "rosévinet", "mousserande vin", "mousserande vinet", "sprit", "spriten", "whisky", "whiskyn", "vodka", "vodkan", "gin", "ginen", "rom", "rommen", "likör", "likören", "cider", "cidern"]
}, {
    "category": "Beverages",
    "sub_category": "Functional Drinks",
    "items": ["protein dryck", "protein drycken", "vitamindryck", "vitamindrycken", "elektrolytdryck", "elektrolytdrycken", "energidryck", "energidrycken", "hälsodryck", "hälsodrycken", "kombucha", "kombuchan", "probiotisk dryck", "probiotiska drycken", "grönsaksdryck", "grönsaksdrycken"]
}, {
    "category": "Beverages",
    "sub_category": "Other Beverages",
    "items": ["smoothie", "smoothien", "saft", "saften", "blanddryck", "blanddrycken", "kall kaffe", "kalla kaffet", "kall chai", "kalla chain", "is-te", "is-teet", "kolsyrad juice", "kolsyrade juicen", "kolsyrad te", "kolsyrade teet", "kolsyrad kaffe", "kolsyrade kaffet", "SHOT INGEF/GURKM",]
}]
const beverages = merge(beveragesSource)

export const categories = {
    "Fruit": fruits,
    "Protein": proteins,
    "Veggies": vegetables,
    "Snacking": snacks,
    "Food Supplies": food_supplies,
    "Bread": merge(bread),
    "Beverages": beverages
};

// assert that categories item is an array
console.assert(
    Object.values(categories).every(category => Array.isArray(category)),
    'All categories should be an array'
)