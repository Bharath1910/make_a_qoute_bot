import Jimp from "jimp"

export default async function makeQoute(
	avatarURL: string,
	qoute: string,
	user: string
): Promise<Buffer> {
	const image = await Jimp.read(avatarURL)
	image.contain(1000, 450, Jimp.HORIZONTAL_ALIGN_LEFT)
	image.background(0x000000)
	image.grayscale()
	const srcImage = await Jimp.read("src/assets/mask.png")
	srcImage.resize(400, 450)
	image.composite(srcImage, 50, 0)
	return Buffer.from(await image.getBufferAsync(Jimp.MIME_JPEG))
}