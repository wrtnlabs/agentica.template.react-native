import {IAgenticaController} from '@agentica/core';
import typia from 'typia';
import * as SMS from 'expo-sms';

export const SMSController: IAgenticaController<'chatgpt'> = {
  protocol: 'class',
  name: 'sms',
  execute: async props =>
    (WRAPPED_SMS as any)[props.function.name](props.arguments),
  application: typia.llm.application<typeof WRAPPED_SMS, 'chatgpt'>(),
};

namespace WRAPPED_SMS {
  interface WrappedSendSMSAsyncProps {
    address: string | string[];
    message: string;
    options?: SMS.SMSOptions;
  }

  /**
   * Opens the default UI/app for sending SMS messages with prefilled addresses and message.
   *
   * @param addresses An array of addresses (phone numbers) or single address passed as strings. Those
   * would appear as recipients of the prepared message.
   * @param message Message to be sent.
   * @param options A `SMSOptions` object defining additional SMS configuration options.
   *
   * @return Returns a Promise that fulfils with the SMS action is invoked by the user, with corresponding result:
   * - If the user cancelled the SMS sending process: `{ result: 'cancelled' }`.
   * - If the user has sent/scheduled message for sending: `{ result: 'sent' }`.
   * - If the status of the SMS message cannot be determined: `{ result: 'unknown' }`.
   *
   * Android does not provide information about the status of the SMS message, so on Android devices
   * the Promise will always resolve with `{ result: 'unknown' }`.
   *
   * > Note: The only feedback collected by this module is whether any message has been sent. That
   * means we do not check actual content of message nor recipients list.
   *
   * @example
   * ```ts
   * const { result } = await SMS.sendSMSAsync({
   *   addresses: ['0123456789', '9876543210'],
   *   message: 'My sample HelloWorld message',
   *   options: {
   *     attachments: {
   *       uri: 'path/myfile.png',
   *       mimeType: 'image/png',
   *       filename: 'myfile.png',
   *     },
   *   }
   * });
   * ```
   */
  export function wrappedSendSMSAsync(props: WrappedSendSMSAsyncProps) {
    return SMS.sendSMSAsync(props.address, props.message, props.options);
  }
}
