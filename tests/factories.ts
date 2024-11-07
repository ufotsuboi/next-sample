import { defineRoomFactory } from "./__generated__/fabbrica";

export const RoomFactory = defineRoomFactory({
  defaultData: async ({ seq }) => ({
    name: `Room${seq.toString().padStart(3, "0")}`,
  }),
});
