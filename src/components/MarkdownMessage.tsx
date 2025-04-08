import {IMessage, MessageTextProps} from 'react-native-gifted-chat';
import {MyProfile} from '../constants';
import Markdown from 'react-native-markdown-display';

export function MarkdownMessage<TMessage extends IMessage>(
  props: MessageTextProps<TMessage>,
) {
  const isMe = props.currentMessage.user.name === MyProfile.name;
  return (
    <Markdown
      style={{body: {color: isMe ? 'white' : 'black', paddingHorizontal: 10}}}>
      {props.currentMessage.text}
    </Markdown>
  );
}
