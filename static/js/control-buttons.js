const newBoardButton = document.querySelector("#new");
const restartButton = document.querySelector("#restart");

newBoardButton.addEventListener("click", async () => {
  window.location.assign(`${window.location.href}new`)
});

restartButton.addEventListener("click", () => {
  window.location.reload();
});

/** Another option for loading a new board is getting a JSON
 object from the server, then parsing it for the board data.
 This avoids a page refresh, but is more lengthy and convoluted,
 especially as more functions would be required to reset the 
 score and timer. 
 With a defined route for /new, could get the JSON with:
  let targetURL = `${window.location.href}new`;
  let fetchObj = { method: "GET" };
  let resp = await fetch(targetURL, fetchObj);
  if (resp.ok) {
    let board = await resp.json();
    loadBoard(board);
  }
*/
function loadBoard(board) {
  document.querySelector(".board").remove();
  let boardDOM = document.createElement("div");
  boardDOM.classList.add("board");
  for (let row of board) {
    let rowDOM = document.createElement("div");
    rowDOM.classList.add("board-row");
    for (let tile of row) {
      let tileDOM = document.createElement("div");
      tileDOM.classList.add("tile");
      tileDOM.textContent = tile;
      rowDOM.append(tileDOM);
    }
    boardDOM.append(rowDOM);
  }
  document.body.prepend(boardDOM);
}