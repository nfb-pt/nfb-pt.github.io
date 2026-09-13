const printButton = document.querySelector("[data-print-issue]");
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener("click", async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => {
        image.loading = "eager";
        return image.decode().catch(() => {});
      }),
    );
    window.print();
  });
}
