import Jimp from "jimp";

export default async function textWrapper(
	image: Jimp,
	quote: Array<string>,
	quoteWord: number,
	lastLineLength: number,
	lastCoord: {x: number, y: number}
) {
	console.log("function called")
	console.log("lastLineLength", lastLineLength)
	console.log("lastCoord", lastCoord)
	console.log("quoteWord", quoteWord)
	console.log("quote", quote)
	console.log("word", quote[quoteWord])
	if (quote[quoteWord] == undefined) return image;
	const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
	if (lastLineLength + quote[quoteWord].length > 21) {
		image.print(font, 400, lastCoord.y + 15, quote[quoteWord],
		async (err, image, {x, y}) => {
			return textWrapper(image, quote, quoteWord + 1, quote[quoteWord].length, {x, y})
		})
	} else {
		image.print(font, lastCoord.x + 5, lastCoord.y, quote[quoteWord],
		async (err, image, {x, y}) => {
			return textWrapper(image, quote, quoteWord + 1, lastLineLength + quote[quoteWord].length, {x, y})
		})
	}
}

// import Jimp from "jimp";

// export default async function textWrapper(
// 	image: Jimp,
// 	quote: Array<string>,
// 	quoteWord: number,
// 	lastLineLength: number,
// 	lastCoord: {x: number, y: number}
// ) {
//     const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

//     const printText = async (image, x, y, text) => {
//         return new Promise((resolve, reject) => {
//             image.print(font, x, y, text, (err, image, {x, y}) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve({image, x, y});
//                 }
//             });
//         });
//     };

//     if (quoteWord >= quote.length) return image;

//     if (lastLineLength + quote[quoteWord].length > 21) {
//         const { image: newImage, x, y } = await printText(image, 400, lastCoord.y + 15, quote[quoteWord]);
//         return textWrapper(newImage, quote, quoteWord + 1, quote[quoteWord].length, { x, y });
//     } else {
//         const { image: newImage, x, y } = await printText(image, 400, lastCoord.y, quote[quoteWord]);
//         return textWrapper(newImage, quote, quoteWord + 1, lastLineLength + quote[quoteWord].length, { x, y });
//     }
// }