export {
  ConversationKind,
  DELETED_BODY,
  UPLOAD_HINT,
  DIRECT_HINT,
  EDITED_MARK,
  OFFLINE_HINT,
  ONLINE_HINT,
  TYPING_HINT,
} from './model'
export type { IConversation, IMember, IMessage } from './model'
export {
  dayLabelOf,
  fileSizeOf,
  hasFile,
  isDayStart,
  isGroup,
  isReadByCompanion,
  membersLabelOf,
  previewOf,
  timeOf,
  titleOf,
  unreadLabelOf,
} from './lib'
