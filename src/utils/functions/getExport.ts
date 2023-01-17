import { APP } from "@utils/constants";
import axios from "axios";

export async function exportPNG({ url, name }: { url: string, name?: string }, setSaving: any) {
  const fileName = name || APP.URLName + "_" + new Date().toLocaleDateString();
  var element = document.createElement("a");
  await axios.get(url, { responseType: "blob" }).then((res) => {
    var file = new Blob([res.data], { type: "image/*" });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.png`;
    element.click();
    setSaving(false);
  });
  
  // var file = new Blob(
  //   [url],
  //   { type: "image/*" }
  // );
  // element.href = URL.createObjectURL(file);
  // element.download = "image.jpg";
  // element.click();
}