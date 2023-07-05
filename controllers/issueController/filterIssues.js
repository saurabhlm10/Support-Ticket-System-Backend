const Issue = require("../../model/Issue");

exports.filterIssues = async (req, res) => {
  const data = req.body;
  console.log(data);
  const arr = [];
  for (let [key, value] of Object.entries(data)) {
    if (value !== "") {
      arr.push([key, value.toLowerCase()]);
    }
  }
  const filterObj = Object.fromEntries(arr);
  console.log(filterObj);

  const filteredData = await Issue.find(filterObj);
  console.log(filteredData);
  res.status(200).json({
    filteredData
  })
};
