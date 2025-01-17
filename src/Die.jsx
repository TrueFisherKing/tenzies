export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return (
        <button
            className={`die-${props.value}` + (props.isHeld ? " held" : "")}
            onClick={props.hold}
            style={styles}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
        ></button>
    )
}