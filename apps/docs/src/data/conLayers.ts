import type { PuppetLayers } from "rebar-ui";

/**
 * Con, the Rebar UI mascot: a concrete block with rebar sticking out of its head, cut into the layers `Puppet` stacks (all one
 * 599 x 846 canvas, files in `public/mascot/`). The art is data, not part of the component: `Puppet` knows nothing about any character.
 */
export const CON: PuppetLayers = {
  body: "/mascot/con-body.png",
  wobble: [
    { src: "/mascot/con-rod-left.png", pivot: [63.4, 14.8] },
    { src: "/mascot/con-rod-right.png", pivot: [78.2, 21.9] },
  ],
  pupils: "/mascot/con-pupils.png",
  eyesMask: "/mascot/con-eyes-mask.png",
  lids: "/mascot/con-lids.png",
};

export const CON_CANVAS: [number, number] = [599, 846];

/** Con's voice: deadpan and terse. The first line always opens. */
export const CON_LINES = ["Already built. Use that one.", "Another Kanban? We have a Kanban.", "Highest tier that works. Go.", "Pick a tier. Not that one."];
