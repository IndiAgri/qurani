from PIL import Image

im1 = Image.open('C:/Users/Hype/.gemini/antigravity-ide/brain/5fee3ef0-37f9-4f31-9d2a-556d5bbd0827/.user_uploaded/media_1791967334786.png')
im2 = Image.open('C:/Users/Hype/.gemini/antigravity-ide/brain/5fee3ef0-37f9-4f31-9d2a-556d5bbd0827/.user_uploaded/media_1791967345357.png')

# green button bg color
print("Gambar 1 green bg:", im1.getpixel((200, 100)))
print("Gambar 2 green bg:", im2.getpixel((200, 80)))
