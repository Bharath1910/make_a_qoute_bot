import Jimp from "jimp"
import textWrapper from "./text_wrapper"

export default async function makeQoute(
	avatarURL: string,
	quote: string,
	user: string
): Promise<Buffer> {
	console.log(avatarURL, quote, user)
	const image = await Jimp.read(avatarURL)
	image.contain(1000, 450, Jimp.HORIZONTAL_ALIGN_LEFT)
	image.background(0x000000)
	image.grayscale()

	const srcImage = await Jimp.read("src/assets/mask.png")
	srcImage.resize(400, 450)

	image.composite(srcImage, 50, 0)
	const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
	await textWrapper(
		image, 
		quote.split(" "), 
		0, 
		0, 
		{x: 400, y: 0}
	)


	return Buffer.from(await image.getBufferAsync(Jimp.MIME_JPEG))
}