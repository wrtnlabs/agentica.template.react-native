import {IAgenticaController} from '@agentica/core';
import * as Battery from 'expo-battery';
import typia from 'typia';

export const BatteryController: IAgenticaController<'chatgpt'> = {
  protocol: 'class',
  name: 'battery',
  execute: async props =>
    (Battery as any)[props.function.name](props.arguments),
  application: typia.llm.application<
    Pick<
      typeof Battery,
      'getBatteryLevelAsync' | 'getBatteryStateAsync' | 'getPowerStateAsync'
    >,
    'chatgpt'
  >(),
};
