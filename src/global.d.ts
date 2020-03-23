// This file will add both p5 instanced and global intellisence
import module from "p5";
import * as p5Global from "p5/global";
import { SketchManager, ControlPanelManager } from "./managers";

declare global {
  interface Window {
    p5: typeof module;
    p: module;
    sketchManager: SketchManager;
    controlPanelManager: ControlPanelManager;
  }
}
