export async function exportPNG({ url }: { url: string }) {
    var element = document.createElement("a");
    var file = new Blob(
      [url],
      { type: "image/*" }
    );
    element.href = URL.createObjectURL(file);
    element.download = "image.jpg";
    element.click();
}