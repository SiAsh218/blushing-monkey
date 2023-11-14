export default class CsvHandler {
  constructor() {}

  // Function to parse csv into an array holding the csv data
  parseCSV(csv) {
    const lines = csv.split("\r\n");

    let headers = lines[0].split(",");

    headers = headers.map((header) => {
      header.replace(/(\r\n|\n|\r)/gm, "").replace(/^"(.*)"$/, "$1");
      return header.trim().toLowerCase();
    });

    const data = [];

    for (let i = 1; i < lines.length; i++) {
      let values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      values = values.map((value) => value.replace(/(\r\n|\n|\r)/gm, ""));

      // Create an object with {keys: columnNames, value:  parsedValues}
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j]
          ? values[j]
              .replace(/"/g, "")
              .replace(/–/g, "-")
              .replace(/‘/g, "'")
              .replace(/’/g, "'")
              .replace(/\n/g, " ")
              .trim()
          : "";
      }

      // Check that the line isn't empty before pusjing into the array
      if (lines[i].length > 0) {
        data.push(obj);
      }
    }

    return data;
  }

  // Function to read the csv data
  async csvImport(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // on fully read
      reader.onload = (e) => {
        const text = e.target.result;

        resolve(text);
      };

      // on error reading
      reader.onerror = (err) => {
        reject(err);
      };

      // read file
      reader.readAsText(file);
    });
  }

  transformDataToCsv(data) {
    const headers = Object.keys(data[0]);

    let csvString = `${headers.join(",")}\n`;
    for (const row of data) {
      let txtArray = [];
      for (const header of headers) {
        txtArray.push(`"${row[header]}"`);
      }

      csvString += `${txtArray.join(",")}\n`;
    }
    return csvString;
  }

  exportCsv(string) {
    const blob = new Blob([string], {
      type: "text/csv;charset=utf-8",
    });

    console.log(blob);

    const filename = "fleetData";

    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    location.reload();
  }
}
