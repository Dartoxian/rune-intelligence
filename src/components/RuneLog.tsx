import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const getInit = (loc: string) => {
  try {
    return JSON.parse(localStorage.getItem(loc)!);
  } catch (err: any) {
    return [];
  }
};

export const RuneLog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [runes, setRunes] = useState<string[]>(getInit("runes"));
  const [blanks, setBlanks] = useState<string[]>(getInit("blanks"));

  useEffect(() => {
    localStorage.setItem("runes", JSON.stringify(runes));
    localStorage.setItem("blanks", JSON.stringify(blanks));
  }, [runes, blanks]);

  return (
    <>
      <Button onClick={onOpen}>Rune Log</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rune Location Log</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={"20px"}>
              <RuneList
                title={"Runes"}
                runes={runes}
                onDelete={(loc: string) => setRunes((r) => r.filter((l) => l !== loc))}
                onAdd={(loc: string) => setRunes((r) => [...r, loc])}
              />
              <RuneList
                title={"Blanks"}
                runes={blanks}
                onDelete={(loc: string) => setBlanks((r) => r.filter((l) => l !== loc))}
                onAdd={(loc: string) => setBlanks((r) => [...r, loc])}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

type RuneListProps = {
  title: string;
  runes: string[];
  onDelete: (runeId: string) => void;
  onAdd: (runeId: string) => void;
};

const RuneList = ({ title, runes, onDelete, onAdd }: RuneListProps) => {
  return (
    <Card flex={"1"} variant={"outline"}>
      <CardHeader>
        <Heading size={"md"}>{title}</Heading>
      </CardHeader>
      <CardBody>
        <Flex flexDirection={"column"} gap={"10px"}>
          {runes.map((rune) => (
            <Flex key={rune} justifyContent={"space-between"}>
              <Text fontSize={"3xl"}>{rune}</Text>
              <Button colorScheme={"red"} onClick={() => onDelete(rune)} size={"sm"} variant={"outline"}>
                X
              </Button>
            </Flex>
          ))}
          <Flex justifyContent={"flex-end"}>
            <LocationInput onSubmit={onAdd} />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

type LocationInputProps = {
  onSubmit: (location: string) => void;
};

const LocationInput = ({ onSubmit }: LocationInputProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setValue("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(value);
    onClose();
  };

  const handleAppend = (char: string) => () => {
    setValue((v) => `${v}${char}`);
  };

  return (
    <>
      <Button colorScheme={"green"} onClick={onOpen}>
        Add
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody gap={"24px"} display={"flex"} flexDirection={"column"}>
            <Card variant={"outline"}>
              <CardBody p={"1rem"} display={"flex"} justifyContent={"space-between"}>
                <Flex justifyContent={"space-between"}>
                  <Text fontSize={"2xl"}>{value}</Text>
                </Flex>
                <Button onClick={() => setValue((v) => v.substring(0, v.length - 1))}>Delete</Button>
              </CardBody>
            </Card>
            <Flex gap={"24px"} justifyContent={"center"}>
              <Card variant={"outline"}>
                <CardBody>
                  <Grid gridTemplateColumns={"repeat(3, 1fr)"} gridGap={"8px"}>
                    {["7", "8", "9", "4", "5", "6", "1", "2", "3", null, "0", null].map((v, i) => (
                      <GridItem key={i}>
                        {v && (
                          <Button size={"lg"} onClick={handleAppend(v)}>
                            {v}
                          </Button>
                        )}
                      </GridItem>
                    ))}
                  </Grid>
                </CardBody>
              </Card>
              <Card variant={"outline"}>
                <CardBody>
                  <Grid gridTemplateColumns={"repeat(3, 1fr)"} gridGap={"8px"}>
                    {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((v, i) => (
                      <GridItem key={i}>
                        {v && (
                          <Button size={"lg"} onClick={handleAppend(v)} w={"100%"}>
                            {v}
                          </Button>
                        )}
                      </GridItem>
                    ))}
                  </Grid>
                </CardBody>
              </Card>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme={"green"} mr={"8px"}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
