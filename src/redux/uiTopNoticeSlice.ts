// store/uiTopNoticeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NoticeVariant = "success" | "error" | "info";

type TopNoticeState = {
  open: boolean;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  href?: string;
  variant: NoticeVariant;
  autoHideMs: number;
};

const initialState: TopNoticeState = {
  open: false,
  variant: "success",
  autoHideMs: 3000,
};

const uiTopNoticeSlice = createSlice({
  name: "uiTopNotice",
  initialState,
  reducers: {
    showTopNotice: (
      state,
      action: PayloadAction<
        Partial<Omit<TopNoticeState, "open">> & { variant?: NoticeVariant }
      >,
    ) => {
      state.open = true;
      state.title = action.payload.title ?? state.title;
      state.subtitle = action.payload.subtitle ?? state.subtitle;
      state.imageUrl = action.payload.imageUrl ?? state.imageUrl;
      state.href = action.payload.href ?? state.href;
      state.variant = action.payload.variant ?? "success";
      state.autoHideMs = action.payload.autoHideMs ?? 3000;
    },
    hideTopNotice: (state) => {
      state.open = false;
    },
  },
});

export const { showTopNotice, hideTopNotice } = uiTopNoticeSlice.actions;
export default uiTopNoticeSlice.reducer;
