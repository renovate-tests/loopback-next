// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Binding, BindingTag} from './binding';
import {BindingAddress} from './binding-key';

/**
 * A function that filters bindings. It returns `true` to select a given
 * binding.
 *
 * **NOTE**: We keep the generic type `T` for backward compatibility. It
 * represents the value type for matched bindings.
 */
// tslint:disable-next-line:no-unused
export type BindingFilter<T = unknown> = (
  binding: Readonly<Binding<unknown>>,
) => boolean;

/**
 * A type guard that asserts the value type for a binding if the filter function
 * returns `true`. This type is very much the same as `BindingFilter` except
 * that it instructs TypeScript compiler that the `binding` parameter is
 * `Readonly<Binding<T>>` when the return value is `true`. For example:
 *
 * ```ts
 * const interceptorFilter: BindingFilterGuard<Interceptor> = (
 *   binding,
 * ): binding is Readonly<Binding<Interceptor>> => binding.tagMap['interceptor'];
 *
 * const myBinding: Binding<unknown> = ...;
 * if (interceptorFilter(myBinding)) {
 *   // Now myBinding is Readonly<Binding<Interceptor>>
 * }
 * ```
 */
export type BindingFilterGuard<T = unknown> = (
  binding: Readonly<Binding<unknown>>,
) => binding is Readonly<Binding<T>>;

/**
 * Select binding(s) by key or a filter function
 */
export type BindingSelector<ValueType = unknown> =
  | BindingAddress<ValueType>
  | BindingFilter<ValueType>;

/**
 * Type guard for binding address
 * @param bindingSelector
 */
export function isBindingAddress(
  bindingSelector: BindingSelector,
): bindingSelector is BindingAddress {
  return typeof bindingSelector !== 'function';
}

/**
 * Create a binding filter for the tag pattern
 * @param tagPattern Binding tag name, regexp, or object
 */
export function filterByTag(tagPattern: BindingTag | RegExp): BindingFilter {
  if (typeof tagPattern === 'string' || tagPattern instanceof RegExp) {
    const regexp =
      typeof tagPattern === 'string'
        ? wildcardToRegExp(tagPattern)
        : tagPattern;
    return b => Array.from(b.tagNames).some(t => regexp!.test(t));
  } else {
    return b => {
      for (const t in tagPattern) {
        // One tag name/value does not match
        if (b.tagMap[t] !== tagPattern[t]) return false;
      }
      // All tag name/value pairs match
      return true;
    };
  }
}

/**
 * Create a binding filter from key pattern
 * @param keyPattern Binding key/wildcard, regexp, or a filter function
 */
export function filterByKey(
  keyPattern?: string | RegExp | BindingFilter,
): BindingFilter {
  if (typeof keyPattern === 'string') {
    const regex = wildcardToRegExp(keyPattern);
    return binding => regex.test(binding.key);
  } else if (keyPattern instanceof RegExp) {
    return binding => keyPattern.test(binding.key);
  } else if (typeof keyPattern === 'function') {
    return keyPattern;
  }
  return () => true;
}

/**
 * Convert a wildcard pattern to RegExp
 * @param pattern A wildcard string with `*` and `?` as special characters.
 * - `*` matches zero or more characters except `.` and `:`
 * - `?` matches exactly one character except `.` and `:`
 */
function wildcardToRegExp(pattern: string): RegExp {
  // Escape reserved chars for RegExp:
  // `- \ ^ $ + . ( ) | { } [ ] :`
  let regexp = pattern.replace(/[\-\[\]\/\{\}\(\)\+\.\\\^\$\|\:]/g, '\\$&');
  // Replace wildcard chars `*` and `?`
  // `*` matches zero or more characters except `.` and `:`
  // `?` matches one character except `.` and `:`
  regexp = regexp.replace(/\*/g, '[^.:]*').replace(/\?/g, '[^.:]');
  return new RegExp(`^${regexp}$`);
}
