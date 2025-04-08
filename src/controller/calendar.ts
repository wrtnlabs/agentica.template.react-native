import {IAgenticaController} from '@agentica/core';
import typia, {Primitive} from 'typia';
import * as Calendar from 'expo-calendar';

/**
 * Controller for handling calendar operations.
 * Implements the IAgenticaController interface for ChatGPT integration.
 */
export const CalendarController: IAgenticaController<'chatgpt'> = {
  protocol: 'class',
  name: 'calendar',
  execute: async props => {
    return (WRAPPED_CALENDAR as any)[props.function.name](props.arguments);
  },
  application: typia.llm.application<typeof WRAPPED_CALENDAR, 'chatgpt'>(),
};

/**
 * Namespace containing all wrapped calendar operations.
 * Provides type-safe interfaces for interacting with the Expo Calendar API.
 */
export namespace WRAPPED_CALENDAR {
  /**
   * Checks if the Calendar API is available on the current device.
   * Note: This only checks if the API is available, not if the app has permissions to use it.
   * @returns A promise that resolves to true if the Calendar API is available, false otherwise.
   */
  export async function wrappedIsAvailableAsync(): Promise<boolean> {
    return Calendar.isAvailableAsync();
  }

  /**
   * Retrieves a list of calendars from the device.
   * On iOS, can optionally filter by entity type (events or reminders).
   * @param props Optional parameters for filtering calendars.
   * @returns A promise that resolves to an array of calendar objects.
   */
  export async function wrappedGetCalendarsAsync(
    props: WrappedGetCalendarsAsyncProps,
  ): Promise<Calendar.Calendar[]> {
    return Calendar.getCalendarsAsync(props.entityType);
  }

  /**
   * Creates a new calendar on the device.
   * @param props The properties for the new calendar.
   * @returns A promise that resolves to the ID of the newly created calendar.
   */
  export async function wrappedCreateCalendarAsync(
    props: WrappedCreateCalendarAsyncProps,
  ): Promise<string> {
    return Calendar.createCalendarAsync(props.details);
  }

  /**
   * Updates an existing calendar's properties.
   * @param props The ID of the calendar to update and the new properties.
   * @returns A promise that resolves to the ID of the updated calendar.
   */
  export async function wrappedUpdateCalendarAsync(
    props: WrappedUpdateCalendarAsyncProps,
  ): Promise<string> {
    return Calendar.updateCalendarAsync(props.id, props.details);
  }

  /**
   * Deletes a calendar and all its associated events/reminders.
   * Warning: This action cannot be undone.
   * @param props The ID of the calendar to delete.
   * @returns A promise that resolves when the calendar is deleted.
   */
  export async function wrappedDeleteCalendarAsync(
    props: WrappedDeleteCalendarAsyncProps,
  ): Promise<void> {
    return Calendar.deleteCalendarAsync(props.id);
  }

  /**
   * Retrieves events from specified calendars within a given time range.
   * Note: The behavior differs between iOS and Android:
   * - iOS returns all events that overlap with the time range
   * - Android returns only events that start and end within the time range
   * @param props The calendar IDs and time range to search.
   * @returns A promise that resolves to an array of event objects.
   */
  export async function wrappedGetEventsAsync(
    props: WrappedGetEventsAsyncProps,
  ): Promise<Calendar.Event[]> {
    return Calendar.getEventsAsync(
      props.calendarIds,
      new Date(props.startDate),
      new Date(props.endDate),
    );
  }

  /**
   * Retrieves a specific event by its ID.
   * For recurring events, can optionally specify a particular instance.
   * @param props The event ID and optional recurring event parameters.
   * @returns A promise that resolves to the event object.
   */
  export async function wrappedGetEventAsync(
    props: WrappedGetEventAsyncProps,
  ): Promise<Calendar.Event> {
    return Calendar.getEventAsync(props.id, {
      ...props.recurringEventOptions,
      instanceStartDate: props.recurringEventOptions?.instanceStartDate
        ? new Date(props.recurringEventOptions.instanceStartDate)
        : undefined,
    });
  }

  /**
   * Creates a new event in the specified calendar.
   * @param props The calendar ID and event data.
   * @returns A promise that resolves to the ID of the newly created event.
   */
  export async function wrappedCreateEventAsync(
    props: WrappedCreateEventAsyncProps,
  ): Promise<string> {
    return Calendar.createEventAsync(props.calendarId, {
      ...props.eventData,
      startDate: new Date(props.eventData.startDate ?? ''),
      endDate: new Date(props.eventData.endDate ?? ''),
      lastModifiedDate: props.eventData.lastModifiedDate
        ? new Date(props.eventData.lastModifiedDate)
        : undefined,
      originalStartDate: props.eventData.originalStartDate
        ? new Date(props.eventData.originalStartDate)
        : undefined,
    });
  }

  /**
   * Updates an existing event's properties.
   * @param props The event ID, new properties, and optional recurring event parameters.
   * @returns A promise that resolves to the ID of the updated event.
   */
  export async function wrappedUpdateEventAsync(
    props: WrappedUpdateEventAsyncProps,
  ): Promise<string> {
    return Calendar.updateEventAsync(
      props.id,
      {
        ...props.details,
        startDate: props.details.startDate
          ? new Date(props.details.startDate)
          : undefined,
        endDate: props.details.endDate
          ? new Date(props.details.endDate)
          : undefined,
        lastModifiedDate: props.details.lastModifiedDate
          ? new Date(props.details.lastModifiedDate)
          : undefined,
        originalStartDate: props.details.originalStartDate
          ? new Date(props.details.originalStartDate)
          : undefined,
      },
      {
        ...props.recurringEventOptions,
        instanceStartDate: props.recurringEventOptions?.instanceStartDate
          ? new Date(props.recurringEventOptions.instanceStartDate)
          : undefined,
      },
    );
  }

  /**
   * Deletes an event from the calendar.
   * @param props The event ID and optional recurring event parameters.
   * @returns A promise that resolves when the event is deleted.
   */
  export async function wrappedDeleteEventAsync(
    props: WrappedDeleteEventAsyncProps,
  ): Promise<void> {
    return Calendar.deleteEventAsync(props.id, props.recurringEventOptions);
  }

  /**
   * Retrieves all attendees for a specific event.
   * @param props The event ID and optional recurring event parameters.
   * @returns A promise that resolves to an array of attendee objects.
   */
  export async function wrappedGetAttendeesForEventAsync(
    props: WrappedGetAttendeesForEventAsyncProps,
  ): Promise<Calendar.Attendee[]> {
    return Calendar.getAttendeesForEventAsync(
      props.id,
      props.recurringEventOptions,
    );
  }

  /**
   * Checks the current permissions for accessing calendars.
   * @returns A promise that resolves to the current permission status.
   */
  export async function wrappedGetCalendarPermissionsAsync(): Promise<Calendar.PermissionResponse> {
    return Calendar.getCalendarPermissionsAsync();
  }

  /**
   * Requests permission to access calendars.
   * @returns A promise that resolves to the permission status after the user responds.
   */
  export async function wrappedRequestCalendarPermissionsAsync(): Promise<Calendar.PermissionResponse> {
    return Calendar.requestCalendarPermissionsAsync();
  }
}

/**
 * Represents the availability status of a calendar event.
 * This determines how the event appears in the user's calendar and affects scheduling.
 */
export type Availability = Calendar.Availability;

/**
 * Represents the status of a calendar event.
 * This indicates the current state of the event in the calendar system.
 */
export type EventStatus = Calendar.EventStatus;

/**
 * Represents the access level for calendar events.
 * This determines who can view or modify the event details.
 */
export type EventAccessLevel = Calendar.EventAccessLevel;

/**
 * Interface representing an event organizer.
 * Contains information about the person or entity that created and manages the event.
 */
export interface WrappedOrganizer {
  /**
   * Indicates whether the current user is the organizer of the event.
   */
  isCurrentUser: boolean;
  /**
   * The name of the organizer.
   */
  name?: string;
  /**
   * The role of the organizer in the event.
   */
  role: string;
  /**
   * The current status of the organizer in relation to the event.
   */
  status: string;
  /**
   * The type of organizer (e.g., person, resource, etc.).
   */
  type: string;
  /**
   * Optional URL associated with the organizer.
   */
  url?: string;
}

/**
 * Interface representing a calendar event with all its properties.
 * This is a wrapped version of the Expo Calendar Event type with additional type safety.
 */
export type WrappedEvent = {
  /**
   * Unique identifier for the event in the calendar system.
   */
  id: string;
  /**
   * Identifier of the calendar that contains this event.
   */
  calendarId: string;
  /**
   * The title or name of the event as displayed in the calendar.
   */
  title: string;
  /**
   * The physical or virtual location where the event takes place.
   */
  location: string;
  /**
   * The date and time when the event record was created in the system.
   * @platform ios
   */
  creationDate?: string;
  /**
   * The date and time when the event was last modified.
   * @platform ios
   */
  lastModifiedDate?: string & typia.tags.Format<'date-time'>;
  /**
   * The time zone in which the event is scheduled.
   */
  timeZone: string;
  /**
   * The time zone for the event's end time, if different from the start time zone.
   * @platform android
   */
  endTimeZone?: string;
  /**
   * A URL associated with the event (e.g., meeting link, event website).
   * @platform ios
   */
  url?: string;
  /**
   * Additional notes or description for the event.
   */
  notes: string;
  /**
   * Array of alarm settings for the event, controlling when notifications are sent.
   */
  alarms: Calendar.Alarm[];
  /**
   * Rules for recurring events. Set to null for one-time events.
   */
  recurrenceRule: Calendar.RecurrenceRule | null;
  /**
   * The start date and time of the event in ISO 8601 format.
   */
  startDate: string & typia.tags.Format<'date-time'>;
  /**
   * The end date and time of the event in ISO 8601 format.
   */
  endDate: string & typia.tags.Format<'date-time'>;
  /**
   * For recurring events, the original start date of the first instance.
   * @platform ios
   */
  originalStartDate?: string & typia.tags.Format<'date-time'>;
  /**
   * Indicates whether this is a modified instance of a recurring event.
   * @platform ios
   */
  isDetached?: boolean;
  /**
   * Whether the event is displayed as an all-day event in the calendar.
   */
  allDay: boolean;
  /**
   * The availability setting for the event (busy, free, tentative).
   */
  availability: Availability;
  /**
   * The current status of the event (none, confirmed, tentative, canceled).
   */
  status: EventStatus;
  /**
   * Information about the event organizer.
   * Only available for events in managed calendars (e.g., Google Calendar, iCloud).
   * @platform ios
   */
  organizer?: WrappedOrganizer;
  /**
   * Email address of the event organizer.
   * @platform android
   */
  organizerEmail?: string & typia.tags.Format<'email'>;
  /**
   * The access level for the event (confidential, private, public, default).
   * @platform android
   */
  accessLevel?: EventAccessLevel;
  /**
   * Whether invited guests can modify the event details.
   * @platform android
   */
  guestsCanModify?: boolean;
  /**
   * Whether invited guests can invite other guests.
   * @platform android
   */
  guestsCanInviteOthers?: boolean;
  /**
   * Whether invited guests can see the list of other guests.
   * @platform android
   */
  guestsCanSeeGuests?: boolean;
  /**
   * For modified instances of recurring events, the ID of the original event.
   * @platform android
   */
  originalId?: string;
  /**
   * For recurring event instances, a volatile ID that may change between instances.
   * @platform android
   */
  instanceId?: string;
};

/**
 * Interface for options when working with recurring events.
 * Controls how modifications to recurring events are handled.
 */
interface WrappedRecurringEventOptions {
  /**
   * If true, applies changes to all future instances of the recurring event.
   * If false, only applies changes to the specified instance.
   */
  futureEvents?: boolean;
  /**
   * The start date of the specific instance to modify, if targeting a single instance
   * of a recurring event.
   */
  instanceStartDate?: string & typia.tags.Format<'date-time'>;
}

/**
 * Interface for retrieving calendars with optional filtering by entity type.
 */
interface WrappedGetCalendarsAsyncProps {
  /**
   * Optional filter to return only calendars of a specific type.
   * On iOS, can be used to filter between event calendars and reminder calendars.
   */
  entityType?: string;
}

/**
 * Interface for creating a new calendar with optional initial properties.
 */
interface WrappedCreateCalendarAsyncProps {
  /**
   * Optional initial properties for the new calendar.
   */
  details?: Primitive<Partial<Calendar.Calendar>>;
}

/**
 * Interface for updating an existing calendar's properties.
 */
interface WrappedUpdateCalendarAsyncProps {
  /**
   * The ID of the calendar to update.
   */
  id: string;
  /**
   * The properties to update on the calendar.
   */
  details?: Primitive<Partial<Calendar.Calendar>>;
}

/**
 * Interface for deleting a calendar.
 */
interface WrappedDeleteCalendarAsyncProps {
  /**
   * The ID of the calendar to delete.
   */
  id: string;
}

/**
 * Interface for retrieving events within a specific time range.
 */
interface WrappedGetEventsAsyncProps {
  /**
   * Array of calendar IDs to search for events.
   */
  calendarIds: string[];
  /**
   * The start of the time range to search for events.
   */
  startDate: string & typia.tags.Format<'date-time'>;
  /**
   * The end of the time range to search for events.
   */
  endDate: string & typia.tags.Format<'date-time'>;
}

/**
 * Interface for retrieving a specific event by ID.
 */
interface WrappedGetEventAsyncProps {
  /**
   * The ID of the event to retrieve.
   */
  id: string;
  /**
   * Optional parameters for handling recurring events.
   */
  recurringEventOptions?: WrappedRecurringEventOptions;
}

/**
 * Interface for creating a new event.
 */
interface WrappedCreateEventAsyncProps {
  /**
   * The ID of the calendar to create the event on.
   */
  calendarId: string;
  /**
   * The data for the new event.
   */
  eventData: Omit<Partial<WrappedEvent>, 'id' | 'organizer'>;
}

/**
 * Interface for updating an existing event.
 */
interface WrappedUpdateEventAsyncProps {
  /**
   * The ID of the event to update.
   */
  id: string;
  /**
   * The properties to update on the event.
   */
  details: Omit<Partial<WrappedEvent>, 'id'>;
  /**
   * Optional parameters for handling recurring events.
   */
  recurringEventOptions?: WrappedRecurringEventOptions;
}

/**
 * Interface for deleting an event.
 */
interface WrappedDeleteEventAsyncProps {
  /**
   * The ID of the event to delete.
   */
  id: string;
  /**
   * Optional parameters for handling recurring events.
   */
  recurringEventOptions?: WrappedRecurringEventOptions;
}

/**
 * Interface for retrieving attendees of an event.
 */
interface WrappedGetAttendeesForEventAsyncProps {
  /**
   * The ID of the event to get attendees for.
   */
  id: string;
  /**
   * Optional parameters for handling recurring events.
   */
  recurringEventOptions?: WrappedRecurringEventOptions;
}
