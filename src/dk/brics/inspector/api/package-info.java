/**
 * API package. Implementations of {@link dk.brics.inspector.api.InspectorAPI} should map implementation-specific types to the types of this package.
 * <p>
 * Implementation note: it could be argued that the content of this package should be all interfaces: but there are three reasons concrete classes are used:
 * <ul>
 * <li>interfaces seems like overkill for plain Java-beans.</li>
 * <li>interfaces would make it a tiny bit harder to serialize and deserialize values when interacting with the client.</li>
 * <li>interfaces would prohibit automatic generation of typescript declaration-files mathcing the types in this package (run './gradlew generateTypeScript').</li>
 * </ul>
 */
package dk.brics.inspector.api;