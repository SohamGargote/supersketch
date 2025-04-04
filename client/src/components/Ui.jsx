import { useAppContext } from "../provider/AppStates";
import Style from "./Style";
import ToolBar from "./ToolBar";
import Zoom from "./Zoom";
import UndoRedo from "./UndoRedo";
import Menu from "./Menu";
import Collaboration from "./Collaboration";

export function Ui() {
  const { selectedElement, selectedTool, style } = useAppContext();

  return (
    <main className="ui">
      <header>
        <Menu />
        <ToolBar />
        <Collaboration />
      </header>
      {(!["selection", "hand"].includes(selectedTool) || selectedElement) && (
        <Style selectedElement={selectedElement || style} />
      )}
      <Zoom />
      <UndoRedo />
    </main>
  );
}
