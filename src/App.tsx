// polyfill
import './shim';

import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {GiftedChat, type IMessage} from 'react-native-gifted-chat';
import OpenAI from 'openai';
import {
  AgenticaDescribeEvent,
  AgenticaAssistantMessageEvent,
  IAgenticaEventJson,
  MicroAgentica,
  AgenticaUserMessageEvent,
} from '@agentica/core';
import {CalendarController} from './controller/calendar';
import {AgenticaProfile, MyProfile} from './constants';
import {MarkdownMessage} from './components/MarkdownMessage';
import {BatteryController} from './controller/battery';
import {SMSController} from './controller/sms';

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
            apiKey: process.env.OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
          }),
          model: 'gpt-4o',
        },
        controllers: [CalendarController, BatteryController, SMSController],
      }),
  );

  const agenticaEventHandler = useCallback(
    async (
      event:
        | AgenticaDescribeEvent<'chatgpt'>
        | AgenticaAssistantMessageEvent
        | AgenticaUserMessageEvent,
    ) => {
      if (event.type !== 'userMessage') {
        await event.join();
      }
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
    agent.on('assistantMessage', agenticaEventHandler);
    agent.on('userMessage', agenticaEventHandler);
    return () => {
      agent.off('describe', agenticaEventHandler);
      agent.off('assistantMessage', agenticaEventHandler);
      agent.off('userMessage', agenticaEventHandler);
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
  event:
    | IAgenticaEventJson.IDescribe
    | IAgenticaEventJson.IAssistantMessage
    | IAgenticaEventJson.IUserMessage,
): IMessage => {
  const isMe = event.type === 'userMessage';
  return {
    _id: new Date().getTime().toString(),
    text:
      event.type === 'userMessage'
        ? event.contents
            .filter(content => content.type === 'text')
            .map(content => content.text)
            .join('')
        : event.text,
    createdAt: new Date(),
    user: isMe ? MyProfile : AgenticaProfile,
  };
};
