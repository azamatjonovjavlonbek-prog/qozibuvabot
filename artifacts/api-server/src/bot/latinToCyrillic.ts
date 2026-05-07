/**
 * O'zbek lotin yozuvini kirill yozuviga o'giradi.
 * 2003-yil standart alifbo asosida.
 */
export function latinToCyrillic(text: string): string {
  // straight va curly apostrof ikkalasini ham qabul qilamiz
  const t = text.replace(/\u2019/g, "'");

  let result = "";
  let i = 0;

  while (i < t.length) {
    const c1 = t[i]!;
    const c2 = t[i + 1] ?? "";
    const pair = c1 + c2;

    // ── Ikki harfli birikmalar ──────────────────────────────────────────────
    if (pair === "Sh" || pair === "SH") { result += "Ш"; i += 2; continue; }
    if (pair === "sh")                  { result += "ш"; i += 2; continue; }
    if (pair === "Ch" || pair === "CH") { result += "Ч"; i += 2; continue; }
    if (pair === "ch")                  { result += "ч"; i += 2; continue; }
    if (pair === "O'" || pair === "O'") { result += "Ў"; i += 2; continue; }
    if (pair === "o'" || pair === "o'") { result += "ў"; i += 2; continue; }
    if (pair === "G'" || pair === "G'") { result += "Ғ"; i += 2; continue; }
    if (pair === "g'" || pair === "g'") { result += "ғ"; i += 2; continue; }
    if (pair === "Ng" || pair === "NG") { result += "Нг"; i += 2; continue; }
    if (pair === "ng")                  { result += "нг"; i += 2; continue; }
    if (pair === "Ts" || pair === "TS") { result += "Тс"; i += 2; continue; }
    if (pair === "ts")                  { result += "тс"; i += 2; continue; }

    // ── Y + unli birikmalar ─────────────────────────────────────────────────
    if (pair === "Ya" || pair === "YA") { result += "Я"; i += 2; continue; }
    if (pair === "ya")                  { result += "я"; i += 2; continue; }
    if (pair === "Yo" || pair === "YO") { result += "Ё"; i += 2; continue; }
    if (pair === "yo")                  { result += "ё"; i += 2; continue; }
    if (pair === "Yu" || pair === "YU") { result += "Ю"; i += 2; continue; }
    if (pair === "yu")                  { result += "ю"; i += 2; continue; }
    if (pair === "Ye" || pair === "YE") { result += "Е"; i += 2; continue; }
    if (pair === "ye")                  { result += "е"; i += 2; continue; }

    // ── Yagona harflar ──────────────────────────────────────────────────────
    switch (c1) {
      case "A": result += "А"; break;
      case "a": result += "а"; break;
      case "B": result += "Б"; break;
      case "b": result += "б"; break;
      case "D": result += "Д"; break;
      case "d": result += "д"; break;
      case "E": result += "Е"; break;
      case "e": result += "е"; break;
      case "F": result += "Ф"; break;
      case "f": result += "ф"; break;
      case "G": result += "Г"; break;
      case "g": result += "г"; break;
      case "H": result += "Ҳ"; break;
      case "h": result += "ҳ"; break;
      case "I": result += "И"; break;
      case "i": result += "и"; break;
      case "J": result += "Ж"; break;
      case "j": result += "ж"; break;
      case "K": result += "К"; break;
      case "k": result += "к"; break;
      case "L": result += "Л"; break;
      case "l": result += "л"; break;
      case "M": result += "М"; break;
      case "m": result += "м"; break;
      case "N": result += "Н"; break;
      case "n": result += "н"; break;
      case "O": result += "О"; break;
      case "o": result += "о"; break;
      case "P": result += "П"; break;
      case "p": result += "п"; break;
      case "Q": result += "Қ"; break;
      case "q": result += "қ"; break;
      case "R": result += "Р"; break;
      case "r": result += "р"; break;
      case "S": result += "С"; break;
      case "s": result += "с"; break;
      case "T": result += "Т"; break;
      case "t": result += "т"; break;
      case "U": result += "У"; break;
      case "u": result += "у"; break;
      case "V": result += "В"; break;
      case "v": result += "в"; break;
      case "X": result += "Х"; break;
      case "x": result += "х"; break;
      case "Y": result += "Й"; break;
      case "y": result += "й"; break;
      case "Z": result += "З"; break;
      case "z": result += "з"; break;
      default:  result += c1;  break;
    }
    i++;
  }

  return result;
}
