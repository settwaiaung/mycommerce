import postPayload from './postPayload'
import putPayload from './putPayload'
import merchantPayload from './merchantPayload'
export default {
  ...postPayload,
  ...putPayload,
  ...merchantPayload
}
