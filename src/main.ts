import { setupCounter } from "./counter.ts";
import "./list.css";
import { GetItemData, actions } from "./store/counterReducer.ts";
import { $ListStore } from "./store/counterStore.ts";
import "./style.css";
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <h1>Vite + TypeScript + Redux Toolkit</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <button id="addList" type="button">Add List</button>
    <div class="user-lists" id="favLists">

    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;
// initialize list - fetch data from api
$ListStore.dispatch(actions.fetchLists());


function MakeAction() {
  GetItemData().then((data) => {
    $ListStore.dispatch(
      actions.addNewList({
        name: data.title,
        items: [{ name: data.title, description: data.description, price: data.price, image: data.thumbnail }],
        id: "",
      })
    );
  });
}



document.querySelector<HTMLButtonElement>("#addList")!.addEventListener("click", () => {
  MakeAction();
});

$ListStore.subscribe(() => {
  updateList();
});

const updateList = () => {
  if($ListStore.getState().favLists.isLoading) {
    document.querySelector<HTMLDivElement>("#favLists")!.innerHTML = `
    <div class="loader">Loading...</div>
    `;
    return;
  }
  document.querySelector<HTMLDivElement>("#favLists")!.innerHTML = `
  ${$ListStore
    .getState()
    .favLists.UserFavorites.map((list) => {
      return `
      <div class="list">
        <div class="header">
          <h3>${list.name}</h3>
          <div>${list.items.length} produktów</div>
        </div>
        <div class="items">
          ${list.items.map((item) => {
            return `
              <div class="item">
                <p class="price">${item.price}</p>
                <div class="image-container"><img src="${item.image}" alt="${item.name}" /></div>
                <button id='removeListBtn' data-id=${list.id}>Remove</button>
              </div>
            `;
          })}
        </div>
      </div>
    `;
    })
    .join("")}
`;
};

OnDelegate("#removeListBtn");

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
function OnDelegate(selector: string) {
  document.addEventListener("click", (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target) {
      return;
    }
    if (target.closest(selector)) {
      $ListStore.dispatch(actions.removeList(target.dataset.id ?? ""));
      // handler.call(target, event);
    }
  });
}
