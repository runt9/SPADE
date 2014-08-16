class EmptyRequestError(Exception):
    """ Designates we received a request expecting data, but was empty """
    pass


class InvalidArgumentError(Exception):
    """ Designates a missing or invalid argument """
    pass