import { Badge, Flex } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import React from "react";

interface PaginationProps {
    page: number;
    totalPages: number;
}

const Pagination = (props: PaginationProps) => {
    const toPaginationPage = (page: number) => {
        if (page < 2) { // clamp start: 2 first pages
            return 2;
        } else if (page > (props.totalPages - 1) - 2 && props.totalPages >= 5) { // clamp end: 2 last pages
            return (props.totalPages - 1) - 2;
        } else {
            return page;
        }
    }

    return (
        <>
            {props.totalPages > 1 &&
                <Flex my={1} direction='row'>
                    <Badge m={1} colorScheme={ props.page <= 0 ? 'gray' : 'blue'}>
                        <Flex direction='column' justifyContent='center' h='100%'>
                            <ChakraLink as={ReactRouterLink} to={'?page=1'}>
                                <BsChevronDoubleRight />
                            </ChakraLink>
                        </Flex>
                    </Badge>
                    <Badge m={1} colorScheme={ props.page <= 0 ? 'gray' : 'blue'}>
                        <Flex direction='column' justifyContent='center' h='100%'>
                            <ChakraLink as={ReactRouterLink} to={`?page=${props.page}`}>
                                <BsChevronRight />
                            </ChakraLink>
                        </Flex>
                    </Badge>
                    <Badge m={1}
                           colorScheme='blue'
                           bgColor={props.page == toPaginationPage(props.page) - 2 ? 'orange.200' : ''}>
                        <ChakraLink as={ReactRouterLink} to={`?page=${(toPaginationPage(props.page) - 1)}`}>
                            {toPaginationPage(props.page) - 1}
                        </ChakraLink>
                    </Badge>
                    { props.totalPages > 1 &&
                        <Badge m={1}
                               colorScheme='blue'
                               bgColor={props.page == toPaginationPage(props.page) - 1 ? 'orange.200' : ''}>
                            <ChakraLink as={ReactRouterLink} to={`?page=${(toPaginationPage(props.page))}`}>
                                {toPaginationPage(props.page)}
                            </ChakraLink>
                        </Badge>
                    } { props.totalPages > 2 &&
                    <Badge m={1}
                           colorScheme='blue'
                           bgColor={props.page == toPaginationPage(props.page) ? 'orange.200' : ''}>
                        <ChakraLink as={ReactRouterLink} to={`?page=${toPaginationPage(props.page) + 1}`}>
                            {toPaginationPage(props.page) + 1}
                        </ChakraLink>
                    </Badge>
                } { props.totalPages > 3 &&
                    <Badge m={1}
                           colorScheme='blue'
                           bgColor={props.page == toPaginationPage(props.page) + 1 ? 'orange.200' : ''}>
                        <ChakraLink as={ReactRouterLink} to={`?page=${(toPaginationPage(props.page) + 2)}`}>
                            {toPaginationPage(props.page) + 2}
                        </ChakraLink>
                    </Badge>
                } { props.totalPages > 4 &&
                    <Badge m={1}
                           colorScheme='blue'
                           bgColor={props.page == toPaginationPage(props.page) + 2 ? 'orange.200' : ''}>
                        <ChakraLink as={ReactRouterLink} to={`?page=${(toPaginationPage(props.page) + 3)}`}>
                            {toPaginationPage(props.page) + 3}
                        </ChakraLink>
                    </Badge>
                }
                    <Badge m={1} colorScheme={props.page >= props.totalPages - 1 ? 'gray' : 'blue'}>
                        <Flex direction='column' justifyContent='center' h='100%'>
                            <ChakraLink as={ReactRouterLink} to={`?page=${props.page + 2}`}>
                                <BsChevronLeft />
                            </ChakraLink>
                        </Flex>
                    </Badge>
                    <Badge m={1} colorScheme={props.page >= props.totalPages - 1 ? 'gray' : 'blue'}>
                        <Flex direction='column' justifyContent='center' h='100%'>
                            <ChakraLink as={ReactRouterLink} to={`?page=${props.totalPages}`}>
                                <BsChevronDoubleLeft />
                            </ChakraLink>
                        </Flex>
                    </Badge>
                </Flex>
            }
        </>
    );
}

export default Pagination;