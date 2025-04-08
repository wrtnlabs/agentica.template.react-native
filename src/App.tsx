// polyfill
import './shim';

import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {GiftedChat, type IMessage} from 'react-native-gifted-chat';
import OpenAI from 'openai';
import {
  AgenticaDescribeEvent,
  AgenticaTextEvent,
  IAgenticaEventJson,
  MicroAgentica,
} from '@agentica/core';
import {CalendarController} from './controller/calendar';
import {AgenticaProfile, MyProfile} from './constants';
import {MarkdownMessage} from './components/MarkdownMessage';

export default function App(): React.JSX.Element {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [agent] = useState<MicroAgentica<'chatgpt'>>(
    () =>
      new MicroAgentica({
        model: 'chatgpt',
        vendor: {
          /**
           * @warning
           * This template is a proof-of-concept template created to demonstrate whether Agentica can call native features.
           * To use this in a production environment, architectural modifications are required to properly secure the OpenAI Key.
           */
          api: new OpenAI({
            apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
          }),
          model: 'gpt-4o',
        },
        controllers: [CalendarController],
      }),
  );

  const agenticaEventHandler = useCallback(
    async (event: AgenticaDescribeEvent<'chatgpt'> | AgenticaTextEvent) => {
      await event.join();
      setMessages(prev =>
        GiftedChat.append(prev, [convertMessage(event.toJSON())]),
      );
    },
    [],
  );

  const sendHandler = useCallback(
    async (message: IMessage[]) => {
      setLoading(true);
      await agent.conversate(message[0].text);
      setLoading(false);
    },
    [agent],
  );

  useEffect(() => {
    agent.on('describe', agenticaEventHandler);
    agent.on('text', agenticaEventHandler);
    return () => {
      agent.off('describe', agenticaEventHandler);
      agent.off('text', agenticaEventHandler);
    };
  }, [agenticaEventHandler, agent]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <GiftedChat
        renderMessageText={MarkdownMessage}
        isTyping={loading}
        messages={messages}
        onSend={sendHandler}
        user={MyProfile}
      />
    </SafeAreaView>
  );
}

const convertMessage = (
  event: IAgenticaEventJson.IDescribe | IAgenticaEventJson.IText,
): IMessage => {
  const isMe = event.type === 'text' && event.role === 'user';
  return {
    _id: new Date().getTime().toString(),
    text: event.text,
    createdAt: new Date(),
    user: isMe ? MyProfile : AgenticaProfile,
  };
};
