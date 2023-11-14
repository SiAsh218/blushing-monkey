export default class FileInput {
  constructor() {}

  /**
   * Method to handle clicks on fileinput elements.
   * @returns returns the uploaded file other wise returns false
   */
  handleClick(e) {
    const fileinput = e.target.closest(".fileinput");

    const button = e.target.closest(".fileinput__button");
    if (!button) return false;

    if (button.classList.contains("fileinput__button--select-file")) {
      const input = button.querySelector("input[type='file']");
      input.click();
      return false;
    } else if (button.classList.contains("fileinput__button--go")) {
      const input = fileinput.querySelector("input[type='file']");

      if (input.files.length < 1) return false;

      return input.files[0];
    }
  }
}
