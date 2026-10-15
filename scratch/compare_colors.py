from PIL import Image

im1 = Image.open('C:/Users/Hype/.gemini/antigravity-ide/brain/5fee3ef0-37f9-4f31-9d2a-556d5bbd0827/.user_uploaded/media_1791967334786.png')
im2 = Image.open('C:/Users/Hype/.gemini/antigravity-ide/brain/5fee3ef0-37f9-4f31-9d2a-556d5bbd0827/.user_uploaded/media_1791967345357.png')

# Let's inspect the font and text in Belum Bayar
# Belum Bayar is around x=500-800 in both images
def sample_text_color(im, name):
    pixels = im.load()
    w, h = im.size
    # find darkest non-white pixel in the Belum Bayar area (x > 500)
    darkest = (255, 255, 255)
    darkest_coord = (0, 0)
    for y in range(h):
        for x in range(500, 800):
            r, g, b = pixels[x, y][:3]
            if (r + g + b) < (darkest[0] + darkest[1] + darkest[2]):
                darkest = (r, g, b)
                darkest_coord = (x, y)
    print(f"{name} darkest text color in Belum Bayar: {darkest} at {darkest_coord}")

sample_text_color(im1, "Gambar 1")
sample_text_color(im2, "Gambar 2")
